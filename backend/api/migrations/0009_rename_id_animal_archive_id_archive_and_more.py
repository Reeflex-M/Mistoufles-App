# Generated by Django 5.1.2 on 2024-11-19 09:31

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_archive_fa_archive_note_archive_statut_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='archive',
            old_name='id_animal',
            new_name='id_archive',
        ),
        migrations.AddField(
            model_name='archive',
            name='date_archive',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='archive',
            name='num_identification',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
