# Generated by Django 5.1.2 on 2024-10-31 13:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_fa_libelle_facebook_fa_commune_fa_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='categorie',
            old_name='libelle_categoie',
            new_name='libelle_categorie',
        ),
    ]
