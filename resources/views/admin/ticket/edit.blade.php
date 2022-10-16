@extends('admin.layouts.app')
@section('main')
<div class="subheader py-2 py-lg-6 subheader-solid" id="kt_subheader">
    <div class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
        <!--begin::Info-->
        <div class="d-flex align-items-center flex-wrap mr-1">
            <!--begin::Page Heading-->
            <div class="d-flex align-items-baseline flex-wrap mr-5">
                <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                    <li class="breadcrumb-item">
                        <a href="{{ Route('admin.ticket.edit', ['id' => $ticket->ticket_id]) }}" class="text-muted">#{{ $ticket->ticket_id }} No'lu Destek Talebi</a>
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
            <a href="{{ Route('admin.ticket.add') }}" class="btn btn-light-primary font-weight-bolder btn-sm">Yeni Talep Gönder</a>

        </div>
        <!--end::Toolbar-->
    </div>
</div>
<div class="d-flex flex-column-fluid">
    <!--begin::Container-->
    <div class="container">
        <!--begin::Card-->

        <!--end::Card-->
        <!--begin::Row-->
        <div class="row">
            <div class="col-xl-4">
                <!--begin::Card-->
                <div class="card card-custom gutter-b">
                    <div class="card-header h-auto py-3 border-0">
                        <div class="card-title">
                            <h3 class="card-label text-danger">{{ $ticket->title }}</h3>
                            
                        </div>
                        <div class="card-toolbar">
                            @if( $ticket->status == 0 )
                                <span class="label font-weight-bold label label-inline label-light-success">Açık</span>
                            @else
                                <span class="label font-weight-bold label label-inline label-light-danger">Kapalı</span>
                            @endif
                            
                        </div>
                    </div>
                    <div class="card-body pt-2">
                        <h3>{{ $ticket->subject }}</h3>
                        <p class="text-dark-50">{{ $ticket->message }}</p>
                        @if( $ticket->status == 0 )
                        <div class="mt-5">
                            <a href="javascript:void(0)" data-id="{{ $ticket->ticket_id }}" class="btn btn-danger btn-sm font-weight-bold mr-2 closeTicket">Destek Talebini Kapat</a>
                        </div>
                        @endif
                    </div>
                </div>
                <!--end::Card-->
                <!--begin::Card-->

                <!--end::Card-->
            </div>
            <div class="col-xl-8">
                @if(Session::has('status'))
                @if (session('status') == 1)
                <div class="alert alert-custom alert-light-success shadow-sm fade show mb-5" role="alert">
                    <div class="alert-icon"><i class="flaticon2-checkmark"></i></div>
                    <div class="alert-text">{{ session('msg') }}</div>
                    <div class="alert-close">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true"><i class="ki ki-close"></i></span>
                        </button>
                    </div>
                </div>
                @endif
                @if (session('status') == 0)
                <div class="alert alert-custom alert-light-danger shadow fade show mb-5" role="alert">
                    <div class="alert-icon"><i class="flaticon2-warning"></i></div>
                    <div class="alert-text">{{ session('msg') }}</div>
                    <div class="alert-close">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true"><i class="ki ki-close"></i></span>
                        </button>
                    </div>
                </div>
                @endif
                @endif
                @if ($errors->any())
                @foreach ($errors->all() as $error)
                <div class="alert alert-custom alert-light-danger shadow fade show mb-5" role="alert">
                    <div class="alert-icon"><i class="flaticon2-warning"></i></div>
                    <div class="alert-text">{{ $error }}</div>
                    <div class="alert-close">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true"><i class="ki ki-close"></i></span>
                        </button>
                    </div>
                </div>
                @endforeach
                @endif
                <div class="card">
                    <!--begin::Header-->
                    <div class="card-header">
                        <h4 class="pt-2">#{{ $ticket->ticket_id }} No'lu Destek Talebi Detayları</h4>
                    </div>
                    <!--end::Header-->
                    <!--begin::Body-->
                    <div class="card-body px-0">
                        <div class="container">
                            <form action="{{ Route('admin.ticket.send') }}" class="form" method="POST">
                                @csrf
                                <div class="form-group">
                                    <label>Yanıt Gönder:</label>
                                    <textarea name="message" class="form-control form-control-lg form-control-solid" id="exampleTextarea" rows="3" placeholder="Mesajınızı buraya yazınız.."></textarea>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <input type="hidden" name="ticket_id" value="{{ $ticket->ticket_id }}" />
                                        <button type="submit" class="btn btn-light-primary font-weight-bold">Cevap Gönder</button>
                                    </div>
                                </div>
                            </form>
                            <div class="separator separator-dashed my-10"></div>
                            @if( $ticket->replies->count() > 0 )
                            <div class="timeline timeline-3">
                                <div class="timeline-items">
                                    @foreach( $ticket->replies as $reply )
                                    <div class="timeline-item">
                                        <div class="timeline-media">
                                            <i class="flaticon2-notification fl text-primary"></i>
                                        </div>
                                        <div class="timeline-content">
                                            <div class="d-flex align-items-center justify-content-between mb-3">
                                                <div class="mr-2">
                                                    <a href="javascript:void(0)" class="text-dark-75 text-hover-primary font-weight-bold">
                                                        @if( $reply->is_admin == 1 )
                                                        <span class="text-danger">Yönetici</span> tarafından yanıtlandı,
                                                        @else
                                                        <span class="text-success">{{ $ticket->user->name }}</span> tarafından yanıtlandı,
                                                        @endif
                                                    </a>
                                                    <span class="text-muted ml-2">{{ \Carbon\Carbon::parse($reply->created_at)->isoFormat('DD MMM YYYY, dddd HH:mm') }}</span>
                                                </div>
                                            </div>
                                            <p class="p-0">{{ $reply->message }}</p>
                                        </div>
                                    </div>
                                    @endforeach
                                </div>
                                
                            </div>
                            @endif
                            <!--end::Timeline-->
                        </div>
                    </div>
                    <!--end::Body-->
                </div>
                <!--end::Card-->
            </div>
        </div>
        <!--end::Row-->
    </div>
    <!--end::Container-->
</div>
@endsection