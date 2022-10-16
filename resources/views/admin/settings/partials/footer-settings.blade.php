<div class="form-group m-form__group">
    <label for="footer_phone">{{ __('backend.footer_phone') }}</label>
    <div class="m-input-icon m-input-icon--right">
        <input type="text" name="settings[footer_phone]" class="form-control m-input" placeholder="Telefon No." value="{{ @$settings['footer_phone'] }}">
            <span class="m-input-icon__icon m-input-icon__icon--right">
                <span>
                    <i class="la la-phone"></i>
                </span>
            </span>
    </div>
    <span class="m-form__help">
        {{ __('backend.footer_phone_desc') }}
    </span>
</div>
<div class="form-group m-form__group">
    <label for="whatsapp_phone">Whatsapp Telefon Hattı</label>
    <div class="m-input-icon m-input-icon--right">
        <input type="text" name="settings[whatsapp_phone]" class="form-control m-input" placeholder="Whatsapp Hattı" value="{{ @$settings['whatsapp_phone'] }}">
    </div>
    <span class="m-form__help">
        {{ __('backend.footer_phone_desc') }}
    </span>
</div>
<div class="form-group m-form__group">
    <label for="footer_mail">{{ __('backend.footer_mail') }}</label>
    <div class="m-input-icon m-input-icon--right">
        <input type="email" name="settings[footer_mail]" class="form-control m-input" placeholder="E-posta adresi" value="{{ @$settings['footer_mail'] }}">
            <span class="m-input-icon__icon m-input-icon__icon--right">
                <span>
                    <i class="la la-envelope"></i>
                </span>
            </span>
    </div>
</div>
<div class="form-group m-form__group">
    <label for="footer_desc">{{ __('backend.footer_desc') }}</label>
    <div class="m-input-icon m-input-icon--right">
        <textarea name="settings[footer_desc]" id="content" class="form-control m-input">{{ @$settings['footer_desc'] }}</textarea>
    </div>
</div>
