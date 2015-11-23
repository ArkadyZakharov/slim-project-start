<?php

$app->get('/', function() use($app) {
	$app->render('layout.html');
})->name('home');