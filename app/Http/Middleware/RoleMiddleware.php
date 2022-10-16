<?php

namespace App\Http\Middleware;

use Closure;

class RoleMiddleware {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @param $role
     * @param null $permission
     *
     * @return mixed
     */
    public function handle($request, Closure $next, $role, $permission = null) {
        /**
         * Fix for "Call to a member function hasRole() on null".
         * If the user is not logged in, there is no user data to process,
         * so we need to throw 404 code.
         */
        
        $roles = explode("|", $role);
        
        if (is_null($request->user())) {
            return redirect()->route('login');
        }

        if (!$request->user()->hasRole($roles)) {
            abort(403);
        }
        if ($permission !== null && !$request->user()->can($permission)) {
            abort(403);
        }
        return $next($request);
    }

}
