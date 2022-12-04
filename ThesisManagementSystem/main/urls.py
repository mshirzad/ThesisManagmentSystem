from django.urls import path, include

from rest_framework.routers import DefaultRouter

from main import views


router = DefaultRouter()

router.register('records', views.getRecords, basename='records')
router.register('add-record', views.addRecord, basename='add-record')

router.register('students', views.getStudents, basename='students')
router.register('add-student', views.addStudent, basename='add-student')




app_name = 'main'

urlpatterns = [
    path('', include(router.urls))
]