from django.contrib import admin
from app.models import *
# Register your models here.

class PageHeaderAccessAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'url', 'order')

admin.site.register(PageHeaderAccess, PageHeaderAccessAdmin)
class PageNavAccessAdmin(admin.ModelAdmin):
  list_display = ('name','parent_id','url', 'header', 'order')
admin.site.register(PageNavAccess, PageNavAccessAdmin)

class AllUserAccessAdmin(admin.ModelAdmin):
  list_display = ('person', 'access','access_code')
admin.site.register(AllUserAccess,AllUserAccessAdmin)

class PersonAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'first_name', 'last_name', 'middle_name', 'suffix', 'party' ]
  
admin.site.register(Person, PersonAdmin)

class PartyAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'description', 'party_type', ]
admin.site.register(Party, PartyAdmin)


class PartyTypeAdmin(admin.ModelAdmin):
  list_display = [ 'description' ]
admin.site.register(PartyType, PartyTypeAdmin)

class ContactTypeAdmin(admin.ModelAdmin):
  list_display = [ 'description' ]
admin.site.register(ContactType, ContactTypeAdmin)

class ContactClassAdmin(admin.ModelAdmin):
  list_display = [ 'description' ]
admin.site.register(ContactClass, ContactClassAdmin)

class PartyContactAdmin(admin.ModelAdmin):
  list_display = [ 'description','party','contact_type','contact_class' ]
admin.site.register(PartyContact, PartyContactAdmin)

class OrgAdmin(admin.ModelAdmin):
  list_display = [ 'description', 'party' ]
admin.site.register(Org, OrgAdmin)

class AddressTypeAdmin(admin.ModelAdmin):
  list_display = [ 'description' ]
admin.site.register(AddressType, AddressTypeAdmin)

class ZipCodeAdmin(admin.ModelAdmin):
  list_display = [ 'description','code' ]
admin.site.register(ZipCode, ZipCodeAdmin)

class CountryAdmin(admin.ModelAdmin):
  list_display = [ 'description' ]
admin.site.register(Country, CountryAdmin)

class RegionAdmin(admin.ModelAdmin):
  list_display = [ 'description', 'country' ]
admin.site.register(Region, RegionAdmin)

class ProvinceAdmin(admin.ModelAdmin):
  list_display = [ 'description', 'region' ]
admin.site.register(Province, ProvinceAdmin)

class CityMunicipalityAdmin(admin.ModelAdmin):
  list_display = [ 'description', 'zip_code', 'province' ]
admin.site.register(CityMunicipality, CityMunicipalityAdmin)

class PartyAddressAdmin(admin.ModelAdmin):
  list_display = [ 'description', 'party', 'address_type', 'city_municipality' ]
admin.site.register(PartyAddress, PartyAddressAdmin)

class PartyRoletypeAdmin(admin.ModelAdmin):
  list_display = ['id', 'roletype_master', 'party' ]
admin.site.register(PartyRoletype, PartyRoletypeAdmin)

class PartyRelationshipMasterAdmin(admin.ModelAdmin):
  list_display = [ 'description' ]
admin.site.register(PartyRelationshipMaster, PartyRelationshipMasterAdmin)

class PartyRelationshipAdmin(admin.ModelAdmin):
  list_display = [ 'party', 'party_relationship_master' ]
admin.site.register(PartyRelationship, PartyRelationshipAdmin)

class AccountAdmin(admin.ModelAdmin):
  list_display = [ 'name' ]
admin.site.register(Account, AccountAdmin)

class AccountAccessAdmin(admin.ModelAdmin):
  list_display = ['access', 'account']
admin.site.register(AccountAccess, AccountAccessAdmin)

class RoletypeMasterAdmin(admin.ModelAdmin):
  list_display = ['id', 'description']
admin.site.register(RoletypeMaster, RoletypeMasterAdmin)

class GroupAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'description', ]
admin.site.register(Group, GroupAdmin)

class AppModulesAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'url', 'description', 'parent_id', ]
admin.site.register(AppModules, AppModulesAdmin)

class PartyGroupAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'party', 'group', ]
admin.site.register(PartyGroup, PartyGroupAdmin)

class GroupAccessAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'description', ]
admin.site.register(GroupAccess, GroupAccessAdmin)

class AccessAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'code', 'description', ]
admin.site.register(Access, AccessAdmin)

class AccessOnAccessGroupAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'access', 'group_access', ]
admin.site.register(AccessOnAccessGroup, AccessOnAccessGroupAdmin)

class GroupAppModulesAdmin(admin.ModelAdmin):
  list_display = [ 'id', 'group', 'app_module', 'group_access', ]
admin.site.register(GroupAppModules, GroupAppModulesAdmin)

class PartyGroupOnCustomAdmin( admin.ModelAdmin ):
  list_display = ['id','party','app_module','group_access', 'group']
admin.site.register(PartyGroupOnCustom, PartyGroupOnCustomAdmin)