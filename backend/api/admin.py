from django.contrib import admin
from .models import Animal, Statut, FA, Categorie, Provenance, Sexe, Archive, Image

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('nom_animal', 'date_arrivee', 'num_identification', 'statut', 'categorie', 'fa')
    search_fields = ('nom_animal', 'num_identification')
    list_filter = ('statut', 'categorie', 'sexe', 'sterilise', 'fa')
    date_hierarchy = 'date_arrivee'

@admin.register(FA)
class FAAdmin(admin.ModelAdmin):
    list_display = ('prenom_fa', 'commune_fa', 'telephone_fa')
    search_fields = ('prenom_fa', 'commune_fa')

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('animal_reference', 'date_upload')
    list_filter = ('date_upload',)

admin.site.register(Statut)
admin.site.register(Categorie)
admin.site.register(Provenance)
admin.site.register(Sexe)
admin.site.register(Archive)
