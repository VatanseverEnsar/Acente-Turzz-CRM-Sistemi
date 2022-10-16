@extends('admin.layouts.app')

@section('main')
<div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <!--begin::Info-->
        <div class="d-flex align-items-center flex-wrap mr-1">
            <!--begin::Page Heading-->
            <div class="d-flex align-items-baseline flex-wrap mr-5">
                <!--begin::Page Title-->
                <h5 class="text-dark font-weight-bold my-1 mr-5">Kullanıcı Rolü Düzenle</h5>
                <!--end::Page Title-->
                <!--begin::Breadcrumb-->
                <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                    <li class="breadcrumb-item">
                        <a href="#" class="text-muted">Kontrol Paneli</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="{{ Route('admin_user_roles') }}" class="text-muted">Kullanıcı Rolleri</a>
                    </li>
                    <li class="breadcrumb-item">
                        <a href="{{ Route('admin_user_roles_edit', ['id'=>$role->id]) }}" class="text-muted">{{ $role->name }} Rolü Düzenle</a>
                    </li>
                </ul>
                <!--end::Breadcrumb-->
            </div>
            <!--end::Page Heading-->
        </div>
        <!--end::Info-->
        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
            <!--begin::Actions-->
            <a href="{{ Route('admin_users') }}" class="btn btn-primary font-weight-bolder mr-5">Kullanıcılar</a>
            <a href="{{ Route('admin_user_add') }}" class="btn btn-primary font-weight-bolder">Yeni Kullanıcı Ekle</a>
        </div>
        <!--end::Toolbar-->
    </div>
</div>
<div class="d-flex flex-column-fluid">
    <div class="container">
        <div class="card card-custom">
            <div class="card-header flex-wrap border-0 pt-6 pb-0">
                <div class="card-title">
                    <h3 class="card-label">{{ $role->name }} Rolü Düzenle
                        <span class="text-muted pt-2 font-size-sm d-block">Kullanıcı rolü yetkilerini açma kapama düğmesi ile ayarlabilirsiniz.</span></h3>
                </div>

            </div>
            <div class="card-body">
                <div class="example-preview">
                    <table class="table">
                        <thead>
                        <tr>
                            <td>Seç</td>
                            <th scope="col">Yetki ID</th>
                            <th scope="col">Yetki Adı</th>
                            <th scope="col">İşlem</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach( $permissions as $p )
                            <tr>
                                <td>
                                    <label class="checkbox checkbox-single">
                                        <input type="checkbox" name="permission" value="{!! $p['id'] !!}" />
                                        <span></span>
                                    </label>

                                </td>
                                <td>{{ $p['slug'] }}</td>
                                <td>{{ $p['name'] }}</td>
                                <td>
                                    @if( $p['status'] == false )
                                        <button type="button" target="_blank" data-perid="{{ $p['id'] }}" data-id="{{ $role->id }}" class="m-portlet__nav-link btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only givePermissionToRole" title="Aktif Et ">
                                            <i class="la la-play-circle"></i>
                                        </button>
                                    @else
                                        <button type="button" target="_blank" data-perid="{{ $p['id'] }}" data-id="{{ $role->id }}" class="m-portlet__nav-link btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only takePermissionFromRole" title="Devredışı Bırak ">
                                            <i class="la la-power-off"></i>
                                        </button>
                                    @endif

                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                    <input type="hidden" name="role_id" value="{{ $role->id }}" />
                    <button class="btn btn-primary mr-3 giveMultipleRolePermission">İşaretlenen Yetkileri Ver</button>
                    <button class="btn btn-danger takeMultipleRolePermission">İşaretlenen Yetkileri Kaldır</button>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
