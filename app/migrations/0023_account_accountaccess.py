# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-13 06:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_auto_20170513_1403'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='AccountAccess',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('access', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.PageNavAccess')),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Account')),
            ],
        ),
    ]
