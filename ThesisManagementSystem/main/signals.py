from main.plagiarism_detector import check_plagiarism
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
 
 
# @receiver(post_save, sender=StudentsInfo)
# def get_all_monographs(sender, instance, created, **kwargs):
#     monographs = []
#     students = StudentsInfo.objects.filter(monograph_language=instance.monograph_language)
#     list(students)
    
#     for student in students:
#         temp = student.monograph_file.path
#         monographs.append(temp)
#     print(monographs)
#     check_plagiarism(monographs_list=monographs)