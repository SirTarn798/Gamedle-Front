# Gamedle
> [!IMPORTANT]
> Gamedle app is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc

## Project details
> เป็นโครงงานเกี่ยวกับเกมทายตัวละครจากเกมที่แบ่งออกเป็น 2 เกม ได้แก่ League of Legends และ Pokémon
- League of Legends แบ่งออกเป็น 2 โหมด ได้แก่
  - Classic
    - เป็นโหมดที่ให้ทำการทาย champion จากเกม League of Legends โดยให้ทำการป้อนชื่อ champion โดยในแต่ละครั้งที่ทำการทาย จะทราบข้อมูลที่ถูกต้อง ข้อมูลที่ผิด และข้อมูลที่ถูกบางส่วน เพื่อทำให้สามารถจำกัดขอบเขตความเป็นไปได้ของคำตอบ
  - Image
    - เป็นโหมดที่ให้ทำการทาย champion จากเกม League of Legends โดยดูจากรูปภาพของ champion ที่แสดงบางส่วน จากนั้นทำการป้อนชื่อของ champion โดยในแต่ละครั้งที่ทำการทาย จะทำการซูมภาพออกเล็กน้อย
  - Runeterra Reflex
    - เกมส์ออนไลน์หลบกระสุน โดยจะมีผู้เล่นในแต่ละเกมจำนวน  3 คน มีระบบการค้นหาห้องอัตโนมัติและระบบการสร้างห้อง
- Pokémon แบ่งออกเป็น 2 โหมด ได้แก่
  - Classic
    - เป็นโหมดที่ให้ทำการทาย pokemon โดยให้ทำการป้อนชื่อ pokemon โดยให้แต่ละครั้งที่ทำการทาย จะทราบข้อมูลที่ถูกต้อง ข้อมูลที่ผิด และข้อมูลที่ถูกบางส่วน เพื่อทำให้สามารถจำกัดขอบเขตความเป็นไปได้ของคำตอบ
  - Image
    - เป็นโหมดที่ให้ทำการทาย pokemon โดยดูจากรูปภาพของ pokemon ที่แสดงบางส่วน จากนั้นทำการป้อนชื่อของ pokemon โดยในแต่ละครั้งที่ทำการทาย จะทำการซูมภาพออกเล็กน้อย

## รายชื่อสมาชิก
- จิรายุ โออุไร 6510405407 SirTarn798
- เจษฎากร วิจิตราการลิขิต 6510405415 peth02
- ธัชวิชย์ ทวีชัยการ 6510405571 NOOKX2
- ภาณุวิชญ์ สังข์ธูป 6510450798 panuwit89
- พิชญ์ชนก คงสมปรีดิ์ 6510450739 Pichanokk

## Clone Project
```bash
git clone https://github.com/SirTarn798/Gamedle-Front
```
```bash
cd Gamdle-Front
```

## Setup Project
### Run Docker
```bash
docker compose up
```
### Create .env file
โดยที่ส่วนใหญ่จะเป็นตัวแปรที่ใช้เชื่อมต่อกับตัวของ CloudFlare R2 เพื่อจัดเก็บข้อมูล

```bash
CLOUDFLARE_R2_ENDPOINT 
CLOUDFLARE_R2_ACCESS_KEY_ID 
CLOUDFLARE_R2_SECRET_ACCESS_KEY 
CLOUDFLARE_R2_TOKEN_VALUE 
CLOUDFLARE_R2_PUBLIC_URL (Public URL เพื่อเชื่อมต่อข้อมูลกับ Client)
CLOUDFLARE_R2_BUCKET_NAME (Bucket ที่สร้าง)

CLOUDFLARE_R2_CHAMP_PICTURE_NAME (ชื่อ Path ของ Object)
CLOUDFLARE_R2_CHAMP_ICON_NAME (ชื่อ Path ของ Object)
CLOUDFLARE_R2_POOKEMON_PICTURE_NAME (ชื่อ Path ของ Object)

NEXT_PUBLIC_API_SERVER_URL (URL ของ API Server ที่ใช้ ในที่นี้ใช้ Laravel)
```

## default users
- Admin
  - username: admin@example.com
  - password: password
- Player
  - username: player@example.com
  - password: password
