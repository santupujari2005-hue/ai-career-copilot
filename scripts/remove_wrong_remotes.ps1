$pattern='santoshsanadi981'
$remotes = & git remote
foreach($r in $remotes){
  if($r -ne ''){
    $url = (& git remote get-url $r) -join ''
    if($url -match $pattern){
      Write-Output "Removing $r -> $url"
      git remote remove $r
    } else {
      Write-Output "Keeping $r -> $url"
    }
  }
}
Write-Output "Done"
