# Generated by Django 5.1.2 on 2024-11-20 09:25

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_remove_archive_archived_at_archive_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='animal',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
