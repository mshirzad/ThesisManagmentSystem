from django.contrib import admin
from main.models import Student, Monograph


class MonographAdmin(admin.ModelAdmin):
	list_display = ('m_id', 'monograph_title', 'year', 'department', 'monograph_file')


class StudentAdmin(admin.ModelAdmin):	
	list_display = ('s_id', 'en_name', 'en_father_name', 'fa_name', 'fa_father_name')


admin.site.register(Monograph, MonographAdmin)
admin.site.register(Student, StudentAdmin)

admin.site.site_header = 'Thesis Management & Plagiarism Detection System'