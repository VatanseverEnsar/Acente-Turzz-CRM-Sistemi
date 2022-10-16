<form autocomplete="off" autofocus="off">
    <div class="row align-items-center">
        <div class="col-lg-12">
            <div class="form-group row align-items-center">
                <div class="col-lg-6">
                    <div class="form-group">
                        <div class="input-icon">
                            <label class="mr-3 mb-0 d-none d-md-block font-weight-bold">Tur İsmi Giriniz:</label>
                            <input type="text" name="q" list="names" class="form-control" placeholder="Tur ismi ile arama yapabilirsiniz" value="{!! \Request::get('q') !!}" />
                            <datalist id="names">
                                @foreach( $tours as $tour )
                                    <option value="{!! $tour->tours_name !!}">
                                @endforeach
                            </datalist>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-lg-12">
                        <label class="mr-3 mb-0 d-none d-md-block">&nbsp</label>
                        <button type="submit" class="btn btn-primary px-6 font-weight-bold mr-3">Filtrele</button>
                        <a href="{!! Route('admin.tour.index') !!}" class="btn btn-danger px-6 font-weight-bold">Temizle</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
