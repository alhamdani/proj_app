# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-05 08:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0029_remove_person_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='marital_status',
            field=models.CharField(default='single', max_length=20),
        ),
    ]