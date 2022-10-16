<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class CustomerUpdateStatus extends Notification {

    use Queueable;
    
    protected $data;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data) {
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable) {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        $status = [
            0 => [
                'title' => 'beklemede',
                'color' => '#8950fc'
            ],
            1 => [
                'title' => 'işleniyor',
                'color' => '#ffa800'
            ],
            2 => [
                'title' => 'red',
                'color' => '#f64e60'
            ],
            3 => [
                'title' => 'satış',
                'color' => '#1bc5bd'
            ],
            4 => [
                'title' => 'ödeme beklemede',
                'color' => '#f64e60'
            ],
            5 => [
                'title' => 'ödeme yapıldı',
                'color' => '#1bc5bd'
            ]
        ];
        return (new MailMessage)
                        ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
                        ->subject('Göndermiş olduğunuz müşterinin durumu '.$status[$this->data['status']]['title'].' olarak güncellendi.')
                        ->line('Merhaba ' . $notifiable->name . ',')
                        ->line(new HtmlString('<strong>Müşteri ID: </strong> '.$this->data['customer_id']))
                        ->line(new HtmlString('<strong>Durum: </strong> <span style="color:'.$status[$this->data['status']]['color'].'">'.$status[$this->data['status']]['title'].'</span> '))
                        ->line(new HtmlString('Marka Temsilci portalına iletmiş olduğunuz '.$this->data['first_name'].' '.$this->data['last_name'].' isimli müşterinizin durumu <span style="color:'.$status[$this->data['status']]['color'].'">'.$status[$this->data['status']]['title'].'</span> olarak güncellenmiştir.'))
                        ->line('Müşteri detaylarına gitmek için ya da durumu satış olarak güncellendi ise ödeme talep etmek için aşağıda ki bağlantıyı kullanabilirsiniz.')
                        ->action('Detaylara Git', Route('admin.customer.index'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable) {
        return [
                //
        ];
    }

}
