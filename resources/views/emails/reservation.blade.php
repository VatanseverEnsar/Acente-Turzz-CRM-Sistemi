<html><head></head>
   <body>
      <table cellspacing="0" cellpadding="0" align="center" style="width: 700px;margin-left: auto;margin-right: auto;border: 1px solid #e5e5e5;border-bottom: 3px solid #FF6600;letter-spacing: -0.5px;">
         <tbody>
            <tr style="background-color: #ff5722;-webkit-print-color-adjust: exact;">
               <td style="width: 15px; border-bottom: solid 2px #FF6600"></td>
               <td style="padding-top: 5px; border-bottom: solid 2px #FF6600">
                  <img src="https://ucuzucuyorum.com/images/logo-white.png">
               </td>
               <td style="text-align: right; font-family: Helvetica,Arial,sans-serif; padding-top: 5px; padding-bottom: 5px; border-bottom: solid 2px #FF6600">
                  <span style="color: #fff; font-size: 20px">Bilgilendirme</span><br>
                  <span style="color: #fff; font-size: 11px">{{ \Carbon\Carbon::now()->isoFormat('DD MMM YYYY') }}</span>
               </td>
               <td style="width: 15px; border-bottom: solid 2px #FF6600"></td>
            </tr>
            <tr>
               <td style="width: 15px"></td>
               <td colspan="2">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                     <tbody>
                        <tr>
                           <td style="width: 50px">&nbsp;</td>
                           <td>
                              <div style="text-align: left; font: 14px Helvetica,Arial,sans-serif; margin: 0; padding-top: 27px; padding-bottom: 15px">
                                 <strong>Sayın {{ $ticket_name }} ,</strong>
                              </div>
                           </td>
                        </tr>
                        <tr>
                           <td style="width: 50px">
                              &nbsp;
                           </td>
                           <td>
                              <p style="font: 16px Helvetica,Arial,sans-serif; margin: 5px 0">Satın alma işleminiz başarılı bir şekilde tamamlanmıştır.</p>
                           </td>
                        </tr>
                        <tr>
                           <td style="width: 50px">&nbsp;</td>
                           <td>
                              <p style="font: 16px Helvetica,Arial,sans-serif;padding-bottom: 10px;">
                                 PNR <span style="font: bold 16px arial; color: #F30707">{{ $booking_code }}</span>
                              </p>
                              <p style="font: 16px Helvetica,Arial,sans-serif;padding-bottom: 10px;">
                                 Bilet No: <b style="font: bold 16px arial; color: #F30707">{{ $ticket_number }}</b>
                              </p>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </td>
               <td style="width: 15px"></td>
            </tr>
            <tr style="
    -webkit-print-color-adjust: exact;
">
               <td style="width: 15px;background: #ff5722;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;">
                  &nbsp;
               </td>
               <td style="background: #ff5722;color: #fff;font-family: Arial,Helvetica;font-size: 16px;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;height: 30px;" colspan="2">
                  Uçuş Bilgileri
               </td>
               <td style="width: 15px;background: #ff5722;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;">&nbsp;</td>
            </tr>
            <tr>
               <td colspan="4">
                  <table cellspacing="0" style="width: 100%; border: none">
                     <tbody style="width: 100%; border: none">
                        <tr style="
                           ">
                           <td width="200" style="background: #f7f7f7;border-bottom: 1px solid #e7e7e7;border-top: 1px solid #e7e7e7;font-family: Arial,Helvetica;font-size: 13px;text-align: left;padding-left: 10px;"><strong>Süre : </strong>{{ totalFlightTimeString($segments, 'departure') }}</td>
                           <td style="background: #f7f7f7; border-bottom: 1px solid #e7e7e7; border-top: 1px solid #e7e7e7; font-family: Arial,Helvetica; font-size: 13px; text-align: center">
                              <strong>
                              Gidiş
                              </strong>
                           </td>
                           <td width="200" style="background: #f7f7f7; border-bottom: 1px solid #e7e7e7; border-top: 1px solid #e7e7e7; font-size: 13px; text-align: right">
                              <div style="padding: 2px; font-family: Arial,Helvetica; font-weight: bold; color: #ababab">Rezervasyon</div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
            <tr>
               <td style="width: 15px"></td>
               <td style="padding: 10px 0" colspan="2">
                  <table width="100%" cellspacing="0" cellpadding="5" border="0" align="left" style="font-size: 12px; font-family: arial">
                      @foreach( $segments['departure'] as $departure )
                      <tbody>
                        <tr>
                           <td style="color: #ababab" colspan="5"><strong>Tarih : {{ \Carbon\Carbon::parse($departure['DepartureDay'])->isoFormat('DD.MM.YYYY') }}</strong></td>
                        </tr>
                        <tr>
                           <td width="20%" rowspan="2">
                              <b>{{ __('airline.'.$departure['MarketingAirline']) }}</b>
                           </td>
                           <td width="10%">{{ $departure['FlightNumber'] }}</td>
                           <td width="10%" style="text-align: right"><strong>Kalkış:</strong></td>
                           <td>{{ \Carbon\Carbon::parse($departure['DepartureDay'])->isoFormat('DD MMMM YYY dddd') }} {{ convert_flight_time($departure['DepartureTime']) }} - {{ \App\Models\GtcAirports::airportNameSinlge($departure['OriginCode']) }}</td>
                        </tr>
                        <tr>
                           <td>Sınıf: {{ $departure['BookingClass'] }}</td>
                           <td style="text-align: right"><strong>Varış:</strong></td>
                           <td>{{ \Carbon\Carbon::parse($departure['ArrivalDay'])->isoFormat('DD MMMM YYY dddd') }} {{ convert_flight_time($departure['ArrivalTime']) }} - {{ \App\Models\GtcAirports::airportNameSinlge($departure['DestinationCode']) }} </td>
                        </tr>
                     </tbody>
                     @endforeach
                  </table>
               </td>
               <td>&nbsp;</td>
            </tr>
            @if( isset($segments['arrival']) && count($segments['arrival']) > 0 )
            <tr>
               <td colspan="4">
                  <table cellspacing="0" style="width: 100%; border: none">
                     <tbody style="width: 100%; border: none">
                        <tr>
                           <td width="200" style="background: #f7f7f7;border-bottom: 1px solid #e7e7e7;border-top: 1px solid #e7e7e7;font-family: Arial,Helvetica;font-size: 13px;text-align: left;padding-left: 10px;"><strong>Süre : </strong>{{ totalFlightTimeString($segments, 'arrival') }}</td>
                           <td style="background: #f7f7f7; border-bottom: 1px solid #e7e7e7; border-top: 1px solid #e7e7e7; font-family: Arial,Helvetica; font-size: 13px; text-align: center">
                              <strong>Dönüş</strong>
                           </td>
                           <td width="200" style="background: #f7f7f7; border-bottom: 1px solid #e7e7e7; border-top: 1px solid #e7e7e7; font-size: 13px; text-align: right">
                              <div style="padding: 2px; font-family: Arial,Helvetica; font-weight: bold; color: #ababab">Rezervasyon</div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </td>
            </tr>
            <tr>
               <td style="width: 15px"></td>
               <td style="padding: 10px 0" colspan="2">
                  <table width="100%" cellspacing="0" cellpadding="5" border="0" align="left" style="font-size: 12px; font-family: arial">

                      @foreach( $segments['arrival'] as $arrival )
                      <tbody>
                        <tr>
                           <td style="color: #ababab" colspan="5"><strong>Tarih : {{ \Carbon\Carbon::parse($arrival['DepartureDay'])->isoFormat('DD.MM.YYYY') }}</strong></td>
                        </tr>
                        <tr>
                           <td width="20%" rowspan="2">
                              <b>{{ __('airline.'.$arrival['MarketingAirline']) }}</b>
                           </td>
                           <td width="10%">{{ $departure['FlightNumber'] }}</td>
                           <td width="10%" style="text-align: right"><strong>Kalkış:</strong></td>
                           <td>{{ \Carbon\Carbon::parse($arrival['DepartureDay'])->isoFormat('DD MMMM YYY dddd') }} {{ convert_flight_time($arrival['DepartureTime']) }} - {{ \App\Models\GtcAirports::airportNameSinlge($arrival['OriginCode']) }}</td>
                        </tr>
                        <tr>
                           <td>Sınıf: {{ $arrival['BookingClass'] }}</td>
                           <td style="text-align: right"><strong>Varış:</strong></td>
                           <td>{{ \Carbon\Carbon::parse($arrival['ArrivalDay'])->isoFormat('DD MMMM YYY dddd') }} {{ convert_flight_time($arrival['ArrivalTime']) }} - {{ \App\Models\GtcAirports::airportNameSinlge($arrival['DestinationCode']) }} </td>
                        </tr>
                     </tbody>
                     @endforeach
                  </table>
               </td>
               <td>&nbsp;</td>
            </tr>
            @endif
            <tr style="font-size: 12px">
               <td colspan="5" style="border-top: 1px solid #ddd; margin-top: 10px; padding-right: 10px; padding-left: 10px; padding-bottom: 10px">
                  <div style="margin-top: 10px">
                     <label></label>
                     <br>
                  </div>
               </td>
               <td></td>
            </tr>
            <tr style="
    -webkit-print-color-adjust: exact;
">
               <td style="width: 15px;background: #ff5722;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;">
                  &nbsp;
               </td>
               <td style="background: #ff5722;color: #fff;font-family: Arial,Helvetica;font-size: 16px;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;height: 30px;" colspan="2">
                  Yolcu Bilgileri
               </td>
               <td style="width: 15px;background: #ff5722;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;">&nbsp;</td>
            </tr>
            <tr>
               <td style="width: 15px"></td>
               <td style="padding: 10px 0" colspan="2">
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                     <tbody>
                        <tr>
                           <td style="font: bold 12px arial; color: #222; padding: 5px">Yolcu Türü</td>
                           <td style="font: bold 12px arial; color: #222; padding: 5px">Yolcu Adı</td>
                           <td style="font: bold 12px arial; color: #222; padding: 5px">Yolcu Soyadı</td>
                           <td style="font: bold 12px arial; color: #222; padding: 5px">Telefon</td>
                           <td style="font: bold 12px arial; color: #222; padding: 5px">E-Posta</td>
                        </tr>
                        @foreach( $passengers['passengers'] as $passenger )
                        <tr>
                           <td style="font: 12px arial; color: #444; padding: 5px">{{ pass_info($passenger['type']) }}</td>
                           <td style="font: 12px arial; color: #444; padding: 5px">{{ $passenger['first_name'] }}</td>
                           <td style="font: 12px arial; color: #444; padding: 5px">{{ $passenger['last_name'] }}</td>

                           <td style="font: 12px arial; color: #444; padding: 5px">{{ $passengers['contact']['phone_code'].' '.$passengers['contact']['phone'] }}</td>
                           <td style="font: 12px arial; color: #ff760d; padding: 5px">{{ $passengers['contact']['email'] }}</td>
                        </tr>
                        @endforeach
                     </tbody>
                  </table>
               </td>
               <td style="width: 15px"></td>
            </tr>
            <tr style="
    -webkit-print-color-adjust: exact;
">
               <td style="width: 15px;background: #ff5722;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;">
                  &nbsp;
               </td>
               <td style="background: #ff5722;color: #fff;font-family: Arial,Helvetica;font-size: 16px;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;height: 30px;" colspan="2">
                  Önemli Bilgiler
               </td>
               <td style="width: 15px;background: #ff5722;border-top: solid 1px #ddd;border-bottom: solid 1px #ddd;">&nbsp;</td>
            </tr>
			<tr>
				<td colspan="3" style="font-family:Arial;padding:10px;font-size:13px;">
					<p>* Koronavirüs(COVID-19) Salgını Çerçevesinde El Bagajı Uygulaması : Koronavirüs(COVID-19) önlemleri çerçevesinde, misafirlerimizin
güvenliği için uçakiçerisine kabin bagajı alınmayacaktır. Misafirlerimizin kabin bagajlarını check-in’de teslim etmesi gerekmektedir. Uçak
içerisine sadece bir adet kadın el çantası, laptop, evrakçantası veya bebekmalzeme çantası alınabilecektir. Kabin bagajı olarakuçakiçerisine
alınacakbagajların ölçüsü ve ağırlığı havayolu özelinde değişmekte olup, ilgili havayolu web adresinden kontrol edilmesi gerekmektedir.</p>
<p>* Genel Kurallar ve Bilgilendirmeler : Bilet ve bagaj kontrolü için; tarifeli kalkışsaatinden iç hatlarda 60 DK., dışhatlarda 75 DK. önce Checkin işlemlerini tamamlamanız gerekmektedir. Havalimanı içerisinde yoğunluğun oluşmaması için yurt içi uçuşlardan 3 saat, yurt dışı uçuşlardan
4 saat önce havalimanında olunması ve Check-in işlemlerinin tamamlanması önerilmektedir. Uçuşun menziline göre (özellikle uzun menzilli
uçuşlarda), havayolu kuralları ve olağanüstü durumlarda Check-in işlemleri daha erken bitebilmekte olup, uçuşunuzu gerçekleştireceğiniz
havayolu web adresinden kontrol edilmelidir. Parça bagaj hakkı uygulaması kapsamında standart uygulamaya göre parça başı 23 KG’ yi aşan
bagajlar uçuşa kabul edilmemektedir. Parça bagaj hakkı havayolu özelinde değişebilmekte olup, uçuşunuzu gerçekleştireceğiniz havayolu web
adresinden kontrol edilmelidir. Seyahat edilecekülkeye geçerli bir vize, aktarmalı uçuşlarda ise geçerli bir transit vizeye sahip olunması
yolcunun sorumluluğundadır. Geçerli bir vize/transit vizeye sahip olunmaması sebebiyle seyahatin gerçekleştirilememesi sonucu ortaya çıkacak
zararlardan MUTOL TURİZM ACENTELİK İNŞAAT SEYAHAT ORGANİZASYON VE TİCARET LİMİTED ŞİRKETİ sorumlu değildir.</p>





				</td>
			</tr>
            <tr>
               <td style="width: 15px"></td>
               <td style="padding: 10px 0" colspan="2">

                  <p style="font: 14px Helvetica,Arial,sans-serif">
                     İyi uçuşlar dileriz
                  </p>
                  <p style="font: 14px Helvetica,Arial,sans-serif">
                     Saygılarımızla,<br>
                  </p>
                  <table width="100%" cellspacing="0" cellpadding="0" border="0">
                     <tbody>
                        <tr></tr>
                     </tbody>
                  </table>
               </td>
               <td style="width: 15px"></td>
            </tr>
         </tbody>
      </table>

</body></html>
