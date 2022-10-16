<div class="card card-custom card-stretch">
    <!--begin::Body-->
    <div class="card-body pt-10">

        <div class="d-flex align-items-center">
            <div class="symbol symbol-60 symbol-xxl-100 mr-5 align-self-start align-self-xxl-center symbol-light-danger">
                <span class="symbol-label font-size-h1">{{ substr($user->name,0,1) }}</span>
                <i class="symbol-badge bg-success"></i>
            </div>
            <div>
                <a href="#" class="font-weight-bolder font-size-h5 text-dark-75 text-hover-primary">{{ $user->name }}</a>
                @php
                $user_role = \App\Models\User::getUserRole($user->id);
                @endphp
                @if( $user_role == 1 )
                <div class="text-danger">Yönetici</div>
                @endif
                @if( $user_role == 3 )
                <div class="text-muted">Acente</div>
                @endif

                <div class="mt-2">
                    <a href="mailto:{{ $user->email }}" class="btn btn-sm btn-success font-weight-bold py-2 px-3 px-xxl-5 my-1">E-posta</a>
                </div>
            </div>
        </div>
        <!--end::User-->
        <!--begin::Contact-->
        <div class="py-9">
            <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="font-weight-bold mr-2">E-posta:</span>
                <a href="#" class="text-muted text-hover-primary">{{ $user->email }}</a>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="font-weight-bold mr-2">Phone:</span>
                @if( $user_meta->phone != NULL )
                <span class="text-muted">{{ @$user_meta->phone_code.''.@$user_meta->phone }}</span>
                @else
                <span class="text-muted">Belirtilmemiş</span>
                @endif
            </div>
            <div class="d-flex align-items-center justify-content-between">
                <span class="font-weight-bold mr-2">Şehir:</span>
                @if( $user_meta->city != NULL )
                {{ \App\Models\User::getCityName($user_meta->city) }}
                @else
                Belirtilmemiş
                @endif
                /
                @if( $user_meta->town != NULL )
                {{ \App\Models\User::getTownName($user_meta->town) }}
                @else
                Belirtilmemiş
                @endif
            </div>
        </div>
        <!--end::Contact-->
        <!--begin::Nav-->
        @include('admin.profile.partials.profile-menu')
        <!--end::Nav-->
    </div>
    <!--end::Body-->
</div>
