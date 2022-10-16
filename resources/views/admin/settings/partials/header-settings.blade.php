<div class="row">
    <div class="form-group m-form__group col-lg-6">
        <label for="site_logo">{{ __('backend.site_logo') }}</label>
        <div class="custom-file">
            <input type="file" name="settings[site_logo]" class="custom-file-input" id="site_logo">
                <label class="custom-file-label" for="site_logo">
                    {{ __('backend.choose_file') }}
                </label>
        </div>
    </div>
    <div class="form-group m-form__group col-lg-6">
        @if( isset($settings['site_logo']) )
        <img class="setting_image" src="{{ url('/userfiles/settings/'.$settings['site_logo']) }}" />
        @endif
    </div>
</div>
<div class="row">
    <div class="form-group m-form__group col-lg-6">
        <label for="site_logo">Site Logo Dark</label>
        <div class="custom-file">
            <input type="file" name="settings[site_logo_dark]" class="custom-file-input" id="site_logo_dark">
                <label class="custom-file-label" for="site_logo_dark">
                    {{ __('backend.choose_file') }}
                </label>
        </div>
    </div>
    <div class="form-group m-form__group col-lg-6">
        @if( isset($settings['site_logo_dark']) )
        <img class="setting_image" src="{{ url('/userfiles/settings/'.$settings['site_logo_dark']) }}" />
        @endif
    </div>
</div>
<div class="row">
    <div class="form-group m-form__group col-lg-6">
        <label for="favicon">{{ __('backend.site_favicon') }}</label>
        <div class="custom-file">
            <input type="file" name="settings[favicon]" class="custom-file-input" id="favicon">
                <label class="custom-file-label" for="favicon">
                    {{ __('backend.choose_file') }}
                </label>
        </div>
    </div>
    <div class="form-group m-form__group col-lg-6">
        @if( isset($settings['favicon']) )
        <img class="setting_image" src="{{ url('/userfiles/settings/'.$settings['favicon']) }}" />
        @endif
    </div>
</div>
<div class="form-group m-form__group">
    <label for="header_phone">{{ __('backend.header_phone') }}</label>
    <div class="m-input-icon m-input-icon--right">
        <input type="text" name="settings[header_phone]" class="form-control m-input" placeholder="Telefon No." value="{{ @$settings['header_phone'] }}">
            <span class="m-input-icon__icon m-input-icon__icon--right">
                <span>
                    <i class="la la-phone"></i>
                </span>
            </span>
    </div>
    <span class="m-form__help">
        {{ __('backend.header_phone_desc') }}
    </span>
</div>