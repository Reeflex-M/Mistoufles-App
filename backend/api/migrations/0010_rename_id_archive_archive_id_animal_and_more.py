# Generated by Django 5.1.2 on 2024-11-19 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_id_animal_archive_id_archive_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='archive',
            old_name='id_archive',
            new_name='id_animal',
        ),
        migrations.RemoveField(
            model_name='archive',
            name='date_archive',
        ),
        migrations.AddField(
            model_name='archive',
            name='biberonnage',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='archive',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='archives', to='api.image'),
        ),
        migrations.AlterField(
            model_name='archive',
            name='num_identification',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
    ]
