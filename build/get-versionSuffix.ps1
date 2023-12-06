Param([string]$branchName, [Int]$buildCounter)

if (!$branchName -or !$buildCounter) {
    Write-Error "`$branchName and `$buildCounter parameters must be supplied"
    exit 1
}

switch -wildcard ($branchName) {
    "master" {
        $preReleaseInfo = ""
    }
    "develop" {
        $preReleaseInfo = "-inte-{0:D6}"
    }
    "hotfix/*" {
        $preReleaseInfo = "-ci-{0:D6}"
    }
    "bugfix/*" {
        $preReleaseInfo = "-ci-{0:D6}"
    }
    "release/*" {
        $preReleaseInfo = "-pre-{0:D6}"
    }
    "feature/*" {
        $isMatch = $branchName -match ".*/([A-Z]+-[\d]+)-"
        if ($isMatch -eq $TRUE) {
            $feature = $Matches[1]
            $preReleaseInfo = "-feature-$feature-{0:D6}"
        }
        else {
            $preReleaseInfo = "-feature-{0:D6}"
        }
    }
    default { $preReleaseInfo = "-ci-{0:D6}" }
}
<# update version for forms-sdk #>
$json = (Get-Content @episerver/forms-sdk/package.json -Raw)

$versionSuffix = "$preReleaseInfo" -f $buildCounter
$version = (Get-Content @episerver/forms-sdk/package.json) -join "`n" | ConvertFrom-Json | Select-Object -ExpandProperty "version"
Write-Output "Version read from package.json: $version"
Write-Output "Version suffix: $versionSuffix"

$fullVersion = "$version$versionSuffix"
Write-Output "Package version: $fullVersion"

$json -replace $version,$fullVersion | Set-Content -Path @episerver/forms-sdk/package.json

<# update version for forms-react #>
$json = (Get-Content @episerver/forms-react/package.json -Raw)

$versionSuffix = "$preReleaseInfo" -f $buildCounter
$version = (Get-Content @episerver/forms-react/package.json) -join "`n" | ConvertFrom-Json | Select-Object -ExpandProperty "version"
Write-Output "Version read from package.json: $version"
Write-Output "Version suffix: $versionSuffix"

$fullVersion = "$version$versionSuffix"
Write-Output "Package version: $fullVersion"

$json -replace $version,$fullVersion | Set-Content -Path @episerver/forms-react/package.json
