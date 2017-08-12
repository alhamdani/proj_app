from django.db import models

class Location(models.Model):
  code = models.CharField(max_length = 50)
  description = models.CharField(max_length = 200)

  def __str__( self ):
    return str( self.description )