$file = 'src\pages\Students.tsx'
$lines = Get-Content $file -Encoding UTF8
$result = [System.Collections.Generic.List[string]]::new()
$state = 'normal'

foreach ($line in $lines) {
    if ($line -match '^<<<<<<< HEAD') {
        $state = 'ours'
        continue
    }
    if ($line -match '^=======') {
        $state = 'theirs'
        continue
    }
    if ($line -match '^>>>>>>> ') {
        $state = 'normal'
        continue
    }
    if ($state -eq 'ours' -or $state -eq 'normal') {
        $result.Add($line)
    }
}

[System.IO.File]::WriteAllLines((Resolve-Path $file), $result, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done. Conflicts resolved, HEAD version kept."
