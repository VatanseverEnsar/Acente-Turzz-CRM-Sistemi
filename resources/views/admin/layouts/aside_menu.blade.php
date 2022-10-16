<button class="m-aside-left-close  m-aside-left-close--skin-dark " id="m_aside_left_close_btn">
    <i class="la la-close"></i>
</button>
<div id="m_aside_left" class="m-grid__item m-aside-left  m-aside-left--skin-dark ">
    <div 
        id="m_ver_menu" 
        class="m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark " 
        data-menu-vertical="true"
        data-menu-scrollable="false" data-menu-dropdown-timeout="500"  
        >
        <ul class="m-menu__nav  m-menu__nav--dropdown-submenu-arrow ">
            <li class="m-menu__item" aria-haspopup="true" >
                <a  href="{{ Route('dashboard') }}" class="m-menu__link ">
                    <i class="m-menu__link-icon flaticon-line-graph"></i>
                    <span class="m-menu__link-title">
                        <span class="m-menu__link-wrap">
                            <span class="m-menu__link-text">{{ __('backend.dashboard') }} </span>
                        </span>
                    </span>
                </a>
            </li>
            <li class="m-menu__section">
                <h4 class="m-menu__section-text">
                    Yönetici İşlemleri
                </h4>
                <i class="m-menu__section-icon flaticon-more-v3"></i>
            </li>
            @if( Auth()->user()->can('can-user') )
            <li class="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
                <a  href="{{ Route('admin_users') }}" class="m-menu__link m-menu__toggle">
                    <i class="m-menu__link-icon flaticon-users"></i>
                    <span class="m-menu__link-text">{{ __('backend.user_management') }}</span>
                    <i class="m-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="m-menu__submenu ">
                    <span class="m-menu__arrow"></span>
                    <ul class="m-menu__subnav">
                        <li class="m-menu__item  m-menu__item--parent" aria-haspopup="true" >
                            <span class="m-menu__link">
                                <span class="m-menu__link-text">
                                    Kullanıcılar
                                </span>
                            </span>
                        </li>
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('admin_users') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la 	la-user"><span></span></i>
                                <span class="m-menu__link-text">
                                    Kullanıcılar
                                </span>
                            </a>
                        </li>
                        @if( Auth()->user()->can('can-role') )
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('admin_user_roles') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la 	la-gears"><span></span></i>
                                <span class="m-menu__link-text">
                                    Kullanıcı Rolleri
                                </span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </div>
            </li>
            @endif

            @if( Auth()->user()->can('can-post') )
                @foreach( \App\Models\PostTypes::all() as $post_type )
                <li class="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
                    <a  href="#" class="m-menu__link m-menu__toggle">
                        <i class="m-menu__link-icon flaticon-interface-1"></i>
                        <span class="m-menu__link-text">{{ $post_type->type_plural_name }}</span>
                        <i class="m-menu__ver-arrow la la-angle-right"></i>
                    </a>
                    <div class="m-menu__submenu ">
                        <span class="m-menu__arrow"></span>
                        <ul class="m-menu__subnav">
                            <li class="m-menu__item  m-menu__item--parent" aria-haspopup="true" >
                                <span class="m-menu__link">
                                    <span class="m-menu__link-text">{{ $post_type->type_plural_name }}</span>
                                </span>
                            </li>
                            <li class="m-menu__item " aria-haspopup="true" >
                                <a  href="{{ url('/posts?').\Illuminate\Support\Arr::query(['post_type' => $post_type->type_slug]) }}" class="m-menu__link ">
                                    <i class="m-menu__link-icon la la-pencil-square-o"><span></span></i>
                                    <span class="m-menu__link-text">{{ $post_type->type_plural_name }}</span>
                                </a>
                            </li>
                            @if( Auth()->user()->can('can-add-post') )
                            <li class="m-menu__item " aria-haspopup="true" >
                                <a  href="{{ Route('add_new_post') }}" class="m-menu__link ">
                                    <i class="m-menu__link-icon la la-plus"><span></span></i>
                                    <span class="m-menu__link-text">{{ __('backend.add_new_'.$post_type->type_slug) }}</span>
                                </a>
                            </li>
                            @endif
                            @if( Auth()->user()->can('can-category') )
                            <li class="m-menu__item " aria-haspopup="true">
                                <a  href="{{ Route('categories') }}" class="m-menu__link ">
                                    <i class="m-menu__link-icon la la-commenting"><span></span></i>
                                    <span class="m-menu__link-text">{{ __('backend.categories') }}</span>
                                </a>
                            </li>
                            @endif
                            @if( Auth()->user()->can('can-trash-post') )
                            <li class="m-menu__item " aria-haspopup="true">
                                <a  href="{{ Route('trash_post') }}" class="m-menu__link ">
                                    <i class="m-menu__link-icon la la-trash"><span></span></i>
                                    <span class="m-menu__link-text">{{ __('backend.trash') }}</span>
                                </a>
                            </li>
                            @endif
                        </ul>
                    </div>
                </li>
                @endforeach
            @endif

            @if( Auth()->user()->can('can-page') )
            <li class="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
                <a  href="#" class="m-menu__link m-menu__toggle">
                    <i class="m-menu__link-icon flaticon-folder-2"></i>
                    <span class="m-menu__link-text">{{ __('backend.pages') }}</span>
                    <i class="m-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="m-menu__submenu ">
                    <span class="m-menu__arrow"></span>
                    <ul class="m-menu__subnav">
                        <li class="m-menu__item  m-menu__item--parent" aria-haspopup="true" >
                            <span class="m-menu__link">
                                <span class="m-menu__link-text">{{ __('backend.posts') }}</span>
                            </span>
                        </li>
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('pages') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-stack-exchange"><span></span></i>
                                <span class="m-menu__link-text">{{ __('backend.pages') }}</span>
                            </a>
                        </li>
                        @if( Auth()->user()->can('can-add-page') )
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('add_new_page') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-plus"><span></span></i>
                                <span class="m-menu__link-text">{{ __('backend.add_new_page') }}</span>
                            </a>
                        </li>
                        @endif
                        @if( Auth()->user()->can('can-trash-page') )
                        <li class="m-menu__item " aria-haspopup="true">
                            <a  href="{{ Route('trash_page') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-trash"><span></span></i>
                                <span class="m-menu__link-text">{{ __('backend.trash') }}</span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </div>
            </li>
            @endif
            
            @if( Auth()->user()->can('can-product') )
            <li class="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
                <a  href="#" class="m-menu__link m-menu__toggle">
                    <i class="m-menu__link-icon flaticon-cart"></i>
                    <span class="m-menu__link-text">{{ __('backend.products') }}</span>
                    <i class="m-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="m-menu__submenu ">
                    <span class="m-menu__arrow"></span>
                    <ul class="m-menu__subnav">
                        <li class="m-menu__item  m-menu__item--parent" aria-haspopup="true" >
                            <span class="m-menu__link">
                                <span class="m-menu__link-text">{{ __('backend.products') }}</span>
                            </span>
                        </li>
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('products') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-pencil-square-o"><span></span></i>
                                <span class="m-menu__link-text">{{ __('backend.products') }}</span>
                            </a>
                        </li>
                        @if( Auth()->user()->can('can-add-product') )
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('add_new_product') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-plus"><span></span></i>
                                <span class="m-menu__link-text">{{ __('backend.add_new_product') }}</span>
                            </a>
                        </li>
                        @endif
                        @if( Auth()->user()->can('can-product-category') )
                        <li class="m-menu__item " aria-haspopup="true">
                            <a  href="{{ Route('product_categories') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-commenting"><span></span></i>
                                <span class="m-menu__link-text">{{ __('backend.product_categories') }}</span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </div>
            </li>
            @endif

            @if( Auth()->user()->can('can-order') )
            <li class="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
                <a  href="#" class="m-menu__link m-menu__toggle">
                    <i class="m-menu__link-icon flaticon-web"></i>
                    <span class="m-menu__link-text">Siparişler</span>
                    <i class="m-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="m-menu__submenu ">
                    <span class="m-menu__arrow"></span>
                    <ul class="m-menu__subnav">
                        <li class="m-menu__item  m-menu__item--parent" aria-haspopup="true" >
                            <span class="m-menu__link">
                                <span class="m-menu__link-text">Siparişler</span>
                            </span>
                        </li>
                        @foreach( $order_statuses as $status )
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('orders', ['slug'=>$status->status_slug]) }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-pencil-square-o"><span></span></i>
                                <span class="m-menu__link-text">{{ $status->status_name }}</span>
                            </a>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </li>
            @endif
            <li class="m-menu__section">
                <h4 class="m-menu__section-text">{{ __('backend.site_settings') }}</h4>
                <i class="m-menu__section-icon flaticon-more-v3"></i>
            </li>
            <li class="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
                <a  href="#" class="m-menu__link m-menu__toggle">
                    <i class="m-menu__link-icon flaticon-interface-3"></i>
                    <span class="m-menu__link-text">
                        {{ __('backend.settings') }}
                    </span>
                    <i class="m-menu__ver-arrow la la-angle-right"></i>
                </a>
                <div class="m-menu__submenu ">
                    <span class="m-menu__arrow"></span>
                    <ul class="m-menu__subnav">

                        <li class="m-menu__item  m-menu__item--parent" aria-haspopup="true" >
                            <span class="m-menu__link">
                                <span class="m-menu__link-text">{{ __('backend.settings') }}</span>
                            </span>
                        </li>
                        @if( Auth()->user()->can('can-settings') )
                        <li class="m-menu__item " aria-haspopup="true" >
                            <a  href="{{ Route('settings') }}" class="m-menu__link ">
                                <i class="m-menu__link-icon la la-cog"><span></span></i>
                                <span class="m-menu__link-text">
                                    {{ __('backend.general_settings') }}
                                </span>
                            </a>
                        </li>
                        @endif
                    </ul>
                </div>
            </li>
            @if( Auth()->user()->can('can-slider') )
            <li class="m-menu__item  m-menu__item--submenu" aria-haspopup="true"  data-menu-submenu-toggle="hover">
                <a  href="{{ Route('sliders') }}" class="m-menu__link m-menu__toggle">
                    <i class="m-menu__link-icon flaticon-background"></i>
                    <span class="m-menu__link-text">Slider Yönetimi</span>
                </a>
            </li>
            @endif
        </ul>
    </div>
    <!-- END: Aside Menu -->
</div>