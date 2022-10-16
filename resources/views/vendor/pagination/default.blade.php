@if ($paginator->hasPages())
<ul class="pagination justify-content-center" role="navigation">
    {{-- Previous Page Link --}}
    @if ($paginator->onFirstPage())
        <a class="btn btn-icon btn-sm btn-light-primary mr-2 my-1" href="#" aria-label="Previous">
            <i class="ki ki-bold-double-arrow-back icon-xs"></i>
        </a>
    @else
    <li class="page-item">
        <a class="page-link page-link--with-arrow" href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="@lang('pagination.previous')">
            <svg class="page-link__arrow page-link__arrow--left" aria-hidden="true" width="8px" height="13px">
            <use xlink:href="{{ asset('frontend/images/sprite.svg#arrow-rounded-left-8x13') }}"></use>
            </svg>
        </a>
    </li>
    @endif

    {{-- Pagination Elements --}}
    @foreach ($elements as $element)
    {{-- "Three Dots" Separator --}}
    @if (is_string($element))
    <li class="disabled" aria-disabled="true"><span>{{ $element }}</span></li>
    @endif

    {{-- Array Of Links --}}
    @if (is_array($element))
    @foreach ($element as $page => $url)
    @if ($page == $paginator->currentPage())
    <li class="page-item active"><a class="page-link" href="#" aria-current="page">{{ $page }} <span class="sr-only">(current)</span></a></li>
    @else
    <li class="page-item"><a class="page-link" href="{{ $url }}">{{ $page }}</a></li>
    @endif
    @endforeach
    @endif
    @endforeach

    {{-- Next Page Link --}}
    @if ($paginator->hasMorePages())
    <li class="page-item">
        <a class="page-link page-link--with-arrow" href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="@lang('pagination.next')">
            <svg class="page-link__arrow page-link__arrow--right" aria-hidden="true" width="8px" height="13px">
            <use xlink:href="{{ asset('frontend/images/sprite.svg#arrow-rounded-right-8x13') }}"></use>
            </svg>
        </a>
    </li>
    @else
    <li class="page-item disabled">
        <a class="page-link page-link--with-arrow" rel="next" aria-label="@lang('pagination.next')">
            <svg class="page-link__arrow page-link__arrow--right" aria-hidden="true" width="8px" height="13px">
            <use xlink:href="{{ asset('frontend/images/sprite.svg#arrow-rounded-right-8x13') }}"></use>
            </svg>
        </a>
    </li>
    @endif
</ul>
@endif
