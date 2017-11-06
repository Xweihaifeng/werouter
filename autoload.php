<?php
class Autoloader {
    public static function myAutoload( $name )
    {
        $file = './library/'.$name.'.php';
        if( file_exists( $file ) )
        {
            require_once( $file );
            if( class_exists($name, false) )
            {
                return true;
            }
        }
        return false;
    }
}
spl_autoload_register('Autoloader::myAutoload');