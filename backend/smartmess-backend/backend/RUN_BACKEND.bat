@echo off
REM Smart-Mess Backend Build & Run Script

echo.
echo ========================================
echo Smart-Mess Inventory System
echo Backend Build & Run Script
echo ========================================
echo.

cd /d "%~dp0"

REM Check if MVN is available
where mvn >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Maven not found in PATH
    echo Attempting to use Maven Wrapper...
    
    if exist mvnw.cmd (
        echo Found Maven Wrapper!
        echo.
        echo Building with Maven Wrapper...
        call mvnw clean install
        
        if %ERRORLEVEL% equ 0 (
            echo.
            echo ========================================
            echo Build successful! Starting application...
            echo ========================================
            echo.
            call mvnw spring-boot:run
        ) else (
            echo Build failed. Check errors above.
            pause
        )
    ) else (
        echo Maven Wrapper not found.
        echo Please install Maven or use an IDE to build the project.
        echo.
        echo Instructions:
        echo 1. Install Maven from https://maven.apache.org/download.cgi
        echo 2. Add Maven bin directory to PATH
        echo 3. Run this script again
        pause
    )
) else (
    echo Maven found!
    echo.
    echo Building project...
    mvn clean install
    
    if %ERRORLEVEL% equ 0 (
        echo.
        echo ========================================
        echo Build successful! Starting application...
        echo ========================================
        echo.
        mvn spring-boot:run
    ) else (
        echo Build failed. Check errors above.
        pause
    )
)

pause
