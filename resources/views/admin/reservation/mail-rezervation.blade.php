<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <meta name="robots" content="index, follow, noodp, noydir" />
    <title>Turzz Rezervasyon Bilgileri</title>
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <link rel="canonical" href="#" />
    <link rel="alternate" href="#" hreflang="en">
    <meta name="author" content="">
    <meta name="theme-color" content="#0096aa">
    <link rel="shortcut icon" href="images/favicon.ico" />
</head>
<body style="margin:0;">
<img src="{{ asset('img/turzz-logo1.png') }}" alt="" style="display:block;margin:50px auto;width: 50%">
<table cellpadding="1" cellspacing="1" style="width: 700px;margin:0 auto;border:1px solid #eee;font-family: Arial;font-size:14px;">
    <tbody>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Rezervasyon İD</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px"> {{ $data['id'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Tur Adı</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['tour_name'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Tur Tipi</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['tour_type'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Acente Adı</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['agent'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Tam İsim</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['full_name'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>E-Posta</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['email'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Satış Fiyatı</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['sale_price'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>İndirimli Fiyatı</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['regular_price'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Talep İçeriği</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['message'] }}</td>
    </tr>
    <tr>
        <td style="border-bottom: 1px solid #eee;padding:10px 20px;color:#9a907e;"><strong>Rezervasyon Tarihi</strong></td>
        <td style="border-bottom: 1px solid #eee;padding:10px 0;">:</td>
        <td style="border-bottom: 1px solid #eee;padding:10px">{{ $data['tour_date'] }}</td>
    </tr>
    </tbody>
</table>
</body>
</html>
