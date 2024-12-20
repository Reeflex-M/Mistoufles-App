# Generated by Django 5.0.1 on 2024-11-19 08:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_archive_antipuce_archive_vermifuge'),
    ]

    operations = [
        migrations.AddField(
            model_name='archive',
            name='fa',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.fa'),
        ),
        migrations.AddField(
            model_name='archive',
            name='note',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='archive',
            name='statut',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.statut'),
        ),
        migrations.AddField(
            model_name='archive',
            name='sterilise',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
