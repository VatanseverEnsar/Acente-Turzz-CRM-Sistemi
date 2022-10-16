<div class="table-responsive">
    <div class="datatable datatable-default datatable-bordered datatable-loaded">
        <table class="table table-head-custom table-vertical-center customer_table" id="tableInit" data-action="customer">
            <thead>
            <tr class="text-uppercase">
                <th class="pl-0" style="min-width:40px">ID</th>
                <th style="min-width: 250px">Tur Adı</th>
                <th style="min-width: 170px">Tur Tipi</th>
                <th style="min-width: 170px">Acente Adı</th>
                <th style="min-width: 170px">Tam İsim</th>
                <th style="min-width: 170px">E-Posta</th>
                <th style="min-width: 170px">Satış Fiyatı</th>
                <th style="min-width: 170px">İndirimli Fiyatı</th>
                <th style="min-width: 170px">Talep İçeriği</th>
                <th style="min-width: 170px">Rezervasyon Tarihi</th>
            </tr>
            </thead>
            <tbody>
            @if( !empty($rezervations) )
                @foreach( $reservations as $data )
                    <tr>
                        <td>{!! $data['id'] !!}</td>
                        <td>{!! $data['tour_name'] !!}</td>
                        <td>{!! $data['tour_type'] !!}</td>
                        <td>{!! $data['agent'] !!}</td>
                        <td>{!! $data['full_name'] !!}</td>
                        <td>{!! $data['email'] !!}</td>
                        <td>{!! $data['sale_price'] !!} TL</td>
                        <td>{!! $data['regular_price'] !!} TL</td>
                        <td>{!! $data['message'] !!}</td>
                        <td>{!! $data['tour_date'] !!}</td>
                    </tr>
                @endforeach
            @endif
            </tbody>
        </table>
    </div>
</div>
