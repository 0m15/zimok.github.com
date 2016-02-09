<?php
$MXM_API_KEY = 'e7f789565328087230aa17ce42a1307a';

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'http://api.musixmatch.com/ws/1.1/');


function get_track_id($title='') {
	curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'http://api.musixmatch.com/ws/1.1/track.search?q_track=azzurro',
    CURLOPT_USERAGENT => 'Codular Sample cURL Request'
	));

	$resp = curl_exec();
	var_dump($resp);
	curl_close();
}
?>