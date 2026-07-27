# 請參閱 https://aka.ms/customizecontainer 了解如何自訂您的偵錯容器，以及 Visual Studio 如何使用此 Dockerfile 來組建您的映像，以加快偵錯速度。

# ASP.NET Core production runtime 執行環境
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080


# 建置專案
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Portfolio.API/Portfolio.API.csproj", "Portfolio.API/"]
RUN dotnet restore "./Portfolio.API/Portfolio.API.csproj"
COPY . .
WORKDIR "/src/Portfolio.API"
RUN dotnet build "./Portfolio.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 發布專案
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Portfolio.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# 正式執行映像
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# 建立圖片資料夾並允許 ASP.NET Core 寫入
USER root
RUN mkdir -p /app/wwwroot/Images/blog \
    && chown -R app:app /app/wwwroot/Images
USER app
ENTRYPOINT ["dotnet", "Portfolio.API.dll"]