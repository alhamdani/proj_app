# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-18 03:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0038_auto_20170706_0641'),
    ]

    operations = [
        migrations.CreateModel(
            name='documentDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.DecimalField(decimal_places=5, max_digits=11)),
                ('unit_price', models.DecimalField(decimal_places=5, max_digits=11)),
                ('delivery_date', models.DateField()),
                ('comments', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='documentHeader',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document_no', models.CharField(max_length=50)),
                ('status', models.IntegerField()),
                ('docdate', models.DateField()),
                ('date_created', models.DateTimeField()),
                ('remarks', models.TextField()),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='company', to='app.Party')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_by', to='app.Party')),
            ],
        ),
        migrations.CreateModel(
            name='documentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='UOM',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='documentheader',
            name='doctype',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.documentType'),
        ),
        migrations.AddField(
            model_name='documentheader',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Location'),
        ),
        migrations.AddField(
            model_name='documentheader',
            name='party',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='party', to='app.Party'),
        ),
        migrations.AddField(
            model_name='documentdetail',
            name='docheader',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.documentHeader'),
        ),
        migrations.AddField(
            model_name='documentdetail',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Product'),
        ),
    ]
