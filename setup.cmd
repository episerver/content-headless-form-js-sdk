SET AlloyMVC=sample\EPiServer.Templates.Alloy.Mvc

IF EXIST %AlloyMVC%\App_Data (
    ECHO Remove all files from the app data folder
    DEL %AlloyMVC%\App_Data\*.* /F /Q || Exit /B 1
) ELSE (
    MKDIR %AlloyMVC%\App_Data || Exit /B 1
)

COPY /y build\database\DefaultSiteContent.episerverdata %AlloyMVC%\App_Data\DefaultSiteContent.episerverdata || Exit /B 1
REM copy the database with ACL
XCOPY /y/i/k build\database\Alloy.mdf %AlloyMVC%\App_Data\ || Exit /B 1