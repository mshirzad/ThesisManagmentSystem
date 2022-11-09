# from django.contrib.auth import get_user_model

from rest_framework import serializers
from main.models import Student, Monograph


class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = '__all__'
        # fields = (
        #     's_id',
        #     'en_name',
        #     'en_father_name',
        #     'en_last_name',
        #     'fa_name',
        #     'fa_father_name',
        #     'fa_last_name',
        # )


class MonographSerializer(serializers.ModelSerializer):

    students = StudentSerializer(many=True, read_only=True)

    class Meta:
        model = Monograph
        fields = (
            'm_id',
            'created_at',
            'updated_at',
            'year',
            'department',
            'monograph_title',
            'monograph_language',
            'monograph_file',
            'source_code_files',
            'students',
        )
        extra_kwargs = {'students': {'required': False}} 







