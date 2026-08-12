;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;; BOT PATROLI SPAWN & MULTI-JOB KILLER (INSTANT ANTI-STUCK) ;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;;;; NEEDED TO RUN ;;;;;
#Include classMemory.ahk

;;;;; OPTIMIZE SORCERY ;;;;;
#SingleInstance Force
#NoEnv
SetBatchLines, -1
ListLines, Off
CoordMode, Mouse, Client
CoordMode, Pixel, Screen
CoordMode, ToolTip, Screen
#InstallMouseHook
SetKeyDelay, 0, 0

; Autostart Run as Admin (Wajib untuk ReadProcessMemory)
if not A_IsAdmin
{
    Run *RunAs "%A_ScriptFullPath%"
    ExitApp
}

; Cek keberadaan Class Memory
if (_ClassMemory.__Class != "_ClassMemory")
{
    MsgBox, Class memory not correctly installed / file classMemory.ahk missing!
    ExitApp
}

;;;;; CONFIG SETTING BOT ;;;;;
global MasterPatroli  := 0
global windowTarget   := "botPatroliChar" ; Nama ID Window
global currentSpotIdx := 1
global patrolDistance := 2  ; Jarak toleransi ke titik target (radius 2 ubin)
global mountDistance  := 12 ; Batas jarak untuk NAIK kereta (Jarak > 13 = Naik Kereta)
global isMounted      := 0  ; Status kereta (0 = Jalan Kaki, 1 = Naik Kereta)

; Variables Anti-Stuck & Safety Auto-OFF
global lastX := 0, lastY := 0, stuckCount := 0
global unstuckRetryCount := 0  ; Hitungan berapa kali berturut-turut mencoba unstuck
global maxUnstuckRetry   := 3  ; BATAS MAKSIMAL UNSTUCK (3x Gagal = BOT AUTO OFF!)
global isUnstuckMode     := 0  ; Sakelar Pemblokir Mount Mutlak
global cdMount    := 2000 ; Cooldown Mount 2 Detik (2000ms)
global lastMount  := 0    ; Timestamp terakhir naik/turun kereta


; === Pilihan Job: "Warr", "Rog", "Mage", "Poet" ===
global pathChar       := "Mage"  

global keyTempest     := "6"     ; Hotkey Tempest
global keyIceBomb     := "4"     ; Hotkey IceBomb untuk Mage
global keyEquake      := "3"     ; Hotkey Equake untuk Poet
global keySpasi       := "Space" ; Hotkey Pukul untuk Warr/Rog
global keyMount       := "r"     ; Hotkey Naik/Turun Kereta

; === DAFTAR RUTE JALAN TOL & TITIK SIKAT ===
global SpawnList := []
InitSpawnList()

InitSpawnList() {
    SpawnList.Push({x: 66,  y: 2,   type: "sikat"})
    SpawnList.Push({x: 53,  y: 2,   type: "sikat"})
    SpawnList.Push({x: 43,  y: 2,   type: "sikat"})
    SpawnList.Push({x: 25,  y: 2,   type: "route"})
    SpawnList.Push({x: 25,  y: 6,   type: "sikat"})
    SpawnList.Push({x: 11,  y: 6,   type: "sikat"})
    SpawnList.Push({x: 11,  y: 15,  type: "sikat"})
    SpawnList.Push({x: 28,  y: 15,  type: "sikat"})
    SpawnList.Push({x: 19,  y: 15,  type: "route"})
    SpawnList.Push({x: 19,  y: 25,  type: "sikat"})
    SpawnList.Push({x: 19,  y: 37,  type: "route"})
    SpawnList.Push({x: 12,  y: 37,  type: "route"})
    SpawnList.Push({x: 12,  y: 42,  type: "route"})
    SpawnList.Push({x: 5,   y: 41,  type: "sikat"})
    SpawnList.Push({x: 6,   y: 52,  type: "sikat"})
    SpawnList.Push({x: 11,  y: 52,  type: "route"})
    SpawnList.Push({x: 11,  y: 64,  type: "sikat"})
    SpawnList.Push({x: 11,  y: 71,  type: "route"})
    SpawnList.Push({x: 5,   y: 71,  type: "sikat"})
    SpawnList.Push({x: 17,  y: 71,  type: "sikat"})
    SpawnList.Push({x: 26,  y: 71,  type: "sikat"})
    SpawnList.Push({x: 25,  y: 63,  type: "sikat"})
    SpawnList.Push({x: 25,  y: 54,  type: "sikat"})
    SpawnList.Push({x: 25,  y: 40,  type: "sikat"})
    SpawnList.Push({x: 40,  y: 40,  type: "sikat"})
    SpawnList.Push({x: 56,  y: 40,  type: "sikat"})
    SpawnList.Push({x: 76,  y: 40,  type: "sikat"})
    SpawnList.Push({x: 76,  y: 60,  type: "sikat"})
    SpawnList.Push({x: 75,  y: 74,  type: "route"})
    SpawnList.Push({x: 83,  y: 73,  type: "sikat"})
    SpawnList.Push({x: 96,  y: 73,  type: "sikat"})
    SpawnList.Push({x: 113, y: 73,  type: "sikat"})
    SpawnList.Push({x: 124, y: 73,  type: "sikat"})
    SpawnList.Push({x: 132, y: 73,  type: "route"})
    SpawnList.Push({x: 132, y: 67,  type: "route"})
    SpawnList.Push({x: 141, y: 67,  type: "sikat"})
    SpawnList.Push({x: 141, y: 60,  type: "sikat"})
    SpawnList.Push({x: 131, y: 61,  type: "sikat"})
    SpawnList.Push({x: 131, y: 54,  type: "route"})
    SpawnList.Push({x: 140, y: 54,  type: "route"})
    SpawnList.Push({x: 140, y: 50,  type: "sikat"})
    SpawnList.Push({x: 120, y: 50,  type: "sikat"})
    SpawnList.Push({x: 107, y: 50,  type: "sikat"})
    SpawnList.Push({x: 108, y: 39,  type: "sikat"})
    SpawnList.Push({x: 122, y: 39,  type: "sikat"})
    SpawnList.Push({x: 135, y: 39,  type: "sikat"})
    SpawnList.Push({x: 135, y: 26,  type: "sikat"})
    SpawnList.Push({x: 141, y: 26,  type: "sikat"})
    SpawnList.Push({x: 127, y: 26,  type: "sikat"})
    SpawnList.Push({x: 127, y: 12,  type: "sikat"})
    SpawnList.Push({x: 140, y: 12,  type: "sikat"})
    SpawnList.Push({x: 140, y: 8,   type: "sikat"})
    SpawnList.Push({x: 128, y: 8,   type: "sikat"})
    SpawnList.Push({x: 113, y: 8,   type: "route"})
    SpawnList.Push({x: 113, y: 5,   type: "sikat"})
    SpawnList.Push({x: 102, y: 5,   type: "sikat"})
    SpawnList.Push({x: 102, y: 12,  type: "sikat"})
    SpawnList.Push({x: 93,  y: 12,  type: "route"})
    SpawnList.Push({x: 93,  y: 5,   type: "sikat"})
    SpawnList.Push({x: 86,  y: 5,   type: "sikat"})
    SpawnList.Push({x: 87,  y: 27,  type: "sikat"})
    SpawnList.Push({x: 68,  y: 27,  type: "sikat"})
    SpawnList.Push({x: 68,  y: 19,  type: "route"})
    SpawnList.Push({x: 66,  y: 19,  type: "sikat"})
    SpawnList.Push({x: 66,  y: 10,  type: "route"})
    SpawnList.Push({x: 78,  y: 10,  type: "sikat"})
    SpawnList.Push({x: 77,  y: 2,   type: "route"})
}

;;;;; INISIALISASI MEMORI WINDOW GAME NEXUS ;;;;;
WinGet, id, List, Nexus
WinSetTitle, % "ahk_id " id1, , %windowTarget%
global charMem := new _ClassMemory(windowTarget, "", hProcessCopy)

ToolTip, [BOT PATROLI READY]`nTekan ' + p untuk ON/OFF, 0, 0, 4
Sleep, 2500
ToolTip,,,, 4

; =================================================================
; TOGGLE ON-OFF BOT PATROLI (Tombol ` + p)
; =================================================================
~` & p::
TogglePatroliLabel:
    MasterPatroli := !MasterPatroli
    if (MasterPatroli) {
        currentSpotIdx := 1
        isMounted := 0
        stuckCount := 0
        unstuckRetryCount := 0
        isUnstuckMode := 0
        SetTimer, PatroliEngine, 150 ; Mesin navigasi berputar tiap 0.15 detik
        ToolTip, [BOT PATROLI: ON] Job: %pathChar%, 0, 0, 2
        SoundBeep, 750, 150
        Sleep, 1000
        ToolTip,,,, 2
    } else {
        SetTimer, PatroliEngine, Off
        ToolTip, [BOT PATROLI: OFF], 0, 0, 2
        SoundBeep, 500, 150
        Sleep, 1000
        ToolTip,,,, 2
    }
return

; Kebalikan jika p dipencet duluan baru tilde (Anti-Salah Pencet)
~p & `::
    Gosub, TogglePatroliLabel
return

; =================================================================
; CORE ENGINE BOT PATROLI
; =================================================================
PatroliEngine:
    if (!MasterPatroli)
        return

    ; BACA KOORDINAT DARI MEMORI
    cX := charMem.read(0x6FE238, "UInt", 0xFC)
    cY := charMem.read(0x6FE238, "UInt", 0x100)

    if (cX = "" or cY = "")
        return

    targetX    := SpawnList[currentSpotIdx].x
    targetY    := SpawnList[currentSpotIdx].y
    targetType := SpawnList[currentSpotIdx].type

    ; HITUNG SELISIH JARAK (Absolut X & Y)
    diffX := Abs(targetX - cX)
    diffY := Abs(targetY - cY)
    totalDistance := diffX + diffY

; CEK APAKAH KARAKTER SEDANG BERJALAN MENUJU TARGET
    if (totalDistance > patrolDistance) {
        if (cX = lastX and cY = lastY) {
            stuckCount++
            
            ; =========================================================
            ; REAKSI INSTAN SAAT NYANGKUT (Cuma Butuh Diam 3 Tick = 0.45s)
            ; =========================================================
            if (stuckCount >= 3) {
                isUnstuckMode := 1 ; LOCK MUTLAK! Haram naik mount selama proses unstuck
                
                ; 1. JIKA LAGI NAIK MOUNT -> TURUN SEKARANG JUGA!
                if (isMounted) {
                    ToolTip, [ANTI-STUCK] Forced Dismount..., 0, 0, 1
                    TryToggleMount(0)
                    Sleep, 150
                }
                isMounted := 0
                
                ; 2. REFRESH VISUAL & TEMBAK SPELL TEMPEST
                ToolTip, [ANTI-STUCK] Executing Spell Tempest!, 0, 0, 1
                ControlSend,, {Blind}^r, %windowTarget%
                Sleep, 100
                
                ControlSend,, {Blind}%keyTempest%, %windowTarget%
                Sleep, 80
                ControlSend,, {Blind}{Enter}, %windowTarget%
                Sleep, 80
                ControlSend,, {Blind}{Esc}, %windowTarget%
                Sleep, 100

                ; 3. SPAM PEMBANTAIAN (Ratakan Mob Penghalang!)
                ToolTip, [ANTI-STUCK] Clearing Obstacle Mobs!, 0, 0, 1
                EksekusiPembantaian(pathChar)
                Sleep, 200

                ; 4. DORONG LANGKAH LURUS 3x KE ARAH TARGET
                dirX := targetX - cX
                dirY := targetY - cY
                if (diffX > diffY) {
                    keyToPress := (dirX > 0) ? "{Right}" : "{Left}"
                } else {
                    keyToPress := (dirY > 0) ? "{Down}" : "{Up}"
                }
                
                Loop, 3 {
                    ControlSend,, {Blind}%keyToPress%, %windowTarget%
                    Sleep, 80
                }
                Sleep, 100
                
                ; 5. SAFETY AUTO-OFF
                if (stuckCount >= 15) {
                    MasterPatroli := 0
                    SetTimer, PatroliEngine, Off
                    ToolTip, [EMERGENCY BOT] Auto Off!, 0, 0, 1
                    
                    ControlSend,, {Blind}{Esc}, %windowTarget%
                    Sleep, 150
                    
                    if (isMounted) {
                        TryToggleMount(0)
                        Sleep, 250
                    }
                    
                    ControlSend,, {Blind}{u}, %windowTarget%
                    Sleep, 150
                    ControlSend,, {Blind}{x}, %windowTarget%
                    
                    Sleep, 2500
                    SoundBeep, 1000, 300
                    SoundBeep, 1500, 500
                    
                    pesanEsc := "BOT DIMATIKAN KARENA NYANGKUT DI (" . cX . ", " . cY . ").`n`nKARAKTER BERHASIL DIEVAKUASI KE SAVE POINT!"
                    MsgBox, 16, EMERGENCY BOT! SUCCESS, %pesanEsc%
                    return
                }
                
                lastX := cX, lastY := cY
                return
            }
        } else {
            ; KARAKTER BERPINDAH KOORDINAT -> Buka kunci & reset hitungan stuck!
            stuckCount := 0 
            unstuckRetryCount := 0
            isUnstuckMode := 0 
        }
        lastX := cX, lastY := cY

        ; =================================================================
        ; LOGIKA NAVIGASI MOUNT (HANYA JALAN JIKA GAK LAGI STUCK / stuckCount = 0)
        ; =================================================================
		if (!isUnstuckMode and stuckCount = 0) {
            
            ; Cek tipe titik SELANJUTNYA (Target N+1) untuk antisipasi tikungan
            nextSpotIdx := currentSpotIdx + 1
            if (nextSpotIdx > SpawnList.MaxIndex())
                nextSpotIdx := 1
            nextTargetType := SpawnList[nextSpotIdx].type

            ; 1. SYARAT NAIK MOUNT (HARUS MEMENUHI SEMUA KONDISI INI):
            ;    a. Jarak ke target saat ini beneran jauh (> 10 ubin)
            ;    b. Target saat ini ATAU target berikutnya BUKAN tikungan pendek
            isTransitZone := (targetType = "route" and nextTargetType = "route") ; Lagi di tengah tikungan L
            
            if (totalDistance > mountDistance and !isMounted and !isTransitZone) {
                TryToggleMount(1)
            }
            
            ; 2. PRE-DISMOUNT:
            ;    Jika mau masuk titik "sikat", jarak sisa dekat (<= 3 ubin), dan lagi di atas mount
            ;    -> Turun kuda pelan-pelan sambil tetep jalan maju
            else if (targetType = "sikat" and totalDistance <= 3 and isMounted) {
                ToolTip, [PRE-DISMOUNT] Preparing Killing Zone..., 0, 0, 1
                TryToggleMount(0)
                isMounted := 0
                Sleep, 100
            }
        }

        ToolTip, [PATROLI %pathChar%] Target: (%targetX%`, %targetY%) [%targetType%] | Dist: %totalDistance% | Train: %isMounted%, 0, 0, 1
        
        StepTowardsAutoFollow(cX, cY, targetX, targetY, diffX, diffY)
        return
    }	

; =================================================================
    ; BILA SUDAH SAMPAI DI RADIUS TARGET (totalDistance <= patrolDistance):
    ; =================================================================
    ; 1. RUWAT / SINKRONISASI TOTAL STATUS (Biar gak pernah desync)
    stuckCount        := 0 
    unstuckRetryCount := 0
    isUnstuckMode     := 0

	if (targetType = "sikat") {
        ; PAKSA KIRIM ESC DAN TOMBOL MOUNT KANAN-KIRI TANPA CEK MEMORI AHK
        ControlSend,, {Blind}{Esc}, %windowTarget%
        Sleep, 50
        
        ; Kirim tombol mount 'r' untuk memastikan jika game sedang di atas mount, karakter langsung turun
        if (isMounted = 1) {
            ControlSend,, {Blind}%keyMount%, %windowTarget%
            Sleep, 100
        }
        
        ; PAKSA RESET MEMORI KEDUANYA KE NOL
        isMounted := 0
        isUnstuckMode := 0

        ToolTip, [KILLING ZONE] Executing %pathChar% Skill!, 0, 0, 1
        EksekusiPembantaian(pathChar) ; Skill cast akan memastikan karakter turun di game
        Sleep, 300 
    }
    else if (targetType = "portal") {
        ToolTip, [PORTAL] Moving Map..., 0, 0, 1
        if (isMounted) {
            TryToggleMount(0)
        }
        isMounted := 0
        Sleep, 2000
    }
    else {
        ToolTip, [WAYPOINT] Passing (%targetX%`, %targetY%), 0, 0, 1
        Sleep, 50
    }

    ; =================================================================
    ; ROTASI FARM & RESET KOORDINAT MEMORI (JURUS SAKTI UNSTUCK)
    ; =================================================================
    ; Netralkan dialog gantung yang bikin hotkey 'r' atau angka suka ke-ketik di chatbox
    ControlSend,, {Blind}{Esc}, %windowTarget%
    Sleep, 50

    ; Refresh posisi koordinat RAM terbaru pasca bergeser/pukul
    cX := charMem.read(0x6FE238, "UInt", 0xFC)
    cY := charMem.read(0x6FE238, "UInt", 0x100)
    if (cX != "" and cY != "") {
        lastX := cX, lastY := cY
    }

    ; Pindah ke titik target selanjutnya
    currentSpotIdx++
    if (currentSpotIdx > SpawnList.MaxIndex()) {
        currentSpotIdx := 1
    }
return


; =================================================================
; FUNGSI EKSEKUSI SKILL BERDASARKAN JOB (pathChar)
; =================================================================
EksekusiPembantaian(job) {
    if (job = "Warr" or job = "Rog") {
        Loop, 15 {
            ControlSend,, {Blind}{%keySpasi%}, %windowTarget%
            Sleep, 60
            if (!MasterPatroli) 
                break
        }
    } 
    else if (job = "Mage") {
        Loop, 20 {
            ControlSend,, {Blind}{v}, %windowTarget%
            Sleep, 80
            ControlSend,, {Blind}%keyIceBomb%, %windowTarget%
            Sleep, 80
            if (!MasterPatroli) 
                break
        }
        ControlSend,, {Blind}{Esc}, %windowTarget%
        Sleep, 100
    } 
    else if (job = "Poet") {
        Loop, 15 {
            ControlSend,, {Blind}{v}, %windowTarget%
            Sleep, 60
            ControlSend,, {Blind}%keyEquake%, %windowTarget%
            Sleep, 60
            ControlSend,, {Blind}{Esc}, %windowTarget%
            Sleep, 60
            if (!MasterPatroli) 
                break
        }
    }
}

; =================================================================
; FUNGSI AUTO-NAVIGATION
; =================================================================
StepTowardsAutoFollow(curX, curY, destX, destY, diffX, diffY) {
    global windowTarget
    
    dirX := destX - curX  ; > 0 Kanan, < 0 Kiri
    dirY := destY - curY  ; > 0 Bawah, < 0 Atas

    if (diffX >= diffY) {
        if (dirX > 0) {
            ControlSend,, {Blind}{Right}, %windowTarget%
        } else if (dirX < 0) {
            ControlSend,, {Blind}{Left}, %windowTarget%
        }
    } 
    else {
        if (dirY > 0) {
            ControlSend,, {Blind}{Down}, %windowTarget%
        } else if (dirY < 0) {
            ControlSend,, {Blind}{Up}, %windowTarget%
        }
    }

    Sleep, 100
}

; =================================================================
; FUNGSI NAIK / TURUN MOUNT
; =================================================================
TryToggleMount(targetStatus) {
    global keyMount, windowTarget, isMounted, cdMount, lastMount
    now := A_TickCount

    if (targetStatus = 0) {
        if (isMounted = 1) {
            SetKeyDelay, 20, 40
            ControlSend,, {Blind}%keyMount%, %windowTarget%
            SetKeyDelay, 0, 0
            Sleep, 150
            
            ControlSend,, {Blind}{Esc 2}, %windowTarget%
            
            isMounted := 0
            lastMount := A_TickCount
            Sleep, 200
            return true
        }
        return false
    }

    if (targetStatus = 1) {
        if (isMounted = 0 && (now - lastMount >= cdMount)) {
            SetKeyDelay, 20, 40
            ControlSend,, {Blind}%keyMount%, %windowTarget%
            SetKeyDelay, 0, 0
            
            isMounted := 1
            lastMount := A_TickCount
            Sleep, 250
            return true
        }
        return false
    }

    return false
}


; Emergency Maintenance
~!p::Reload
~!^q::ExitApp