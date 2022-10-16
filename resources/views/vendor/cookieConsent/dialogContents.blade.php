<div class="js-cookie-consent cookie-consent">

    <span class="cookie-consent__message">
        {!! trans('cookieConsent::texts.message') !!}
    </span>

    <button class="js-cookie-consent-agree cookie-consent__agree">
        {{ trans('cookieConsent::texts.agree') }}
    </button>
    <a href="{{ Route('post_single', ['slug'=>'datenschutz']) }}" class="weiter">
        {{ trans('cookieConsent::texts.weiter') }}
    </a>

</div>
