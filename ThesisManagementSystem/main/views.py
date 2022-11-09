import json

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.db.models.query_utils import Q

from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from main.models import Student, Monograph
from main.serializers import StudentSerializer, MonographSerializer
from main.plagiarism_detector import check_plagiarism

@login_required(login_url='login/')
def home(request):
    
    return render(request, 'main/index.html')

@login_required(login_url='login/')
def addNewRecord(request):
    
    return render(request, 'main/add_record.html')

def login_(request):
    success_url = 'http://127.0.0.1:8000/'
    user = request.user

    if user.is_authenticated:
        return redirect('home')

    if request.method == 'GET':
        return render(request, 'main/login.html')

    elif request.method == 'POST':
        data = json.loads(request.body)

        for key in data:
            if data[key] == '':

                resp = {'error': True,
                        'message': f'{key} can not be empty', 'error-key': key}
                return JsonResponse(resp)

        username = data['username']
        password = data['password']

        msg = ''
        print('before authenticating')
        if not user.is_authenticated:
            print('inside if of authenticating')
            auth_user = authenticate(username=username, password=password)
            print(auth_user, 'after auth of authenticating')

            if auth_user is not None:
                login(request, auth_user)
                print('after login')
                resp = {'error': False, 'message': "Login Successful",
                        'success_url': success_url}
                print(resp)
                print(JsonResponse(resp))
                return JsonResponse(resp)

            else:
                msg = 'Username or Password is Incorrect!'
                print(msg)
                resp = {'error': True, 'message': msg}
                return JsonResponse(resp)

        else:
            resp = {'error': False,
                    'success_url': success_url}
            return JsonResponse(resp)

@login_required(login_url='login/')
def logout_(request):
    logout(request)
    return HttpResponseRedirect('/login/')


######### API Related Code ###########

class getStudents(viewsets.GenericViewSet, 
                    mixins.ListModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.RetrieveModelMixin):

    permission_classes = (IsAuthenticated,)
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class addStudent(viewsets.GenericViewSet, 
                mixins.CreateModelMixin):
    
    permission_classes = (IsAuthenticated,)
    queryset = Student.objects.all()    
    serializer_class = StudentSerializer


class getRecords(viewsets.GenericViewSet, 
                    mixins.ListModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.RetrieveModelMixin):

    permission_classes = (IsAuthenticated,)
    queryset = Monograph.objects.all().order_by('created_at')
    serializer_class = MonographSerializer


class addRecord(viewsets.GenericViewSet, 
                mixins.CreateModelMixin):
    
    permission_classes = (IsAuthenticated,)
    queryset = Monograph.objects.all()    
    serializer_class = MonographSerializer


    def create(self, request, *arg, **kwargs):

        def merge(dict1, dict2):
            res = {**dict1, **dict2}
            return res

        target = request.data['monograph_file']
        
        monographs = []
        monographs.append(target)

        ##### CHECKING ONLY THE SAME DEPARTMENT MONOGRAPHS #####

        fetched_monographs = Monograph.objects.filter(
            monograph_language=request.data['monograph_language'],
            department=request.data['department'])
        
        for m in list(fetched_monographs):
            temp = m.monograph_file.path
            monographs.append(temp)

        plagiarism_result = check_plagiarism(target=target, monographs_list=monographs)
        pal_score = 0
        
        if len(plagiarism_result) != 0:
            for i in range(0, len(plagiarism_result)):
                pal_score = pal_score + plagiarism_result[i][2]

        ##### IF PLAGIARISM NOT FOUND IN SAME DEPARTMENTS BELOW CHECKS ALL DEPARTMENT MONOGRAPHS EXCEPT THE MONOGRAPHS WHICH IS CHECKED BEFORE #####

        if pal_score <= 0.5:
            fetched_monographs = Monograph.objects.filter(
                monograph_language=request.data['monograph_language']).exclude(
                    department=request.data['department'])
        
            monographs.clear()
            monographs.append(target)

            for m in list(fetched_monographs):
                temp = m.monograph_file.path
                monographs.append(temp)

            plagiarism_result = check_plagiarism(target=target, monographs_list=monographs)
            
            if len(plagiarism_result) != 0:
                for i in range(0, len(plagiarism_result)):
                    pal_score = pal_score + plagiarism_result[i][2]

        if pal_score <= 0.5:
            print('no pal detected') 
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers=self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
        elif pal_score <= 0.8 and pal_score >0.5:
            print('partially pal detected') 
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers=self.get_success_headers(serializer.data)

            details = {'target_file': '',
                        'similar with': '',
                        'similarity score':''}

            for i in range(0, len(plagiarism_result)):
                details = {f'{i}target_file': str(plagiarism_result[i][0]),
                            f'{i}similar with': plagiarism_result[i][1],
                            f'{i}similarity score': plagiarism_result[i][2]}

            json.dumps(details)
            combined_data = merge(serializer.data, details)
            return Response(combined_data, status=status.HTTP_201_CREATED, headers=headers)

        else:
            print("inside else")
            details = {'target_file': '',
                        'similar with': '',
                        'similarity score':''}

            for i in range(0, len(plagiarism_result)):
                details = {f'{i}target_file': str(plagiarism_result[i][0]),
                            f'{i}similar with': plagiarism_result[i][1],
                            f'{i}similarity score': plagiarism_result[i][2]}

            json.dumps(details)
            return Response(details, status=status.HTTP_400_BAD_REQUEST)


    def perform_create(self, serializer):
        serializer.save()