/** @OnlyCurrentDoc */
// ↑ SECURITY: Restricts this script's Sheets/Docs authorization scope to
// ONLY this bound spreadsheet (instead of every Sheet/Doc in the user's
// Drive). Does not affect DriveApp calls to the template/folder IDs below —
// those still work exactly as before. Safer + faster to authorize.

// ═════════════════════════════════════════════════════════════════════
// BRANDEX LAW ASSOCIATES — FULL MAILMERGE + WEB FORM HANDLER
// Copy this ENTIRE file into your Google Apps Script project
// Then: Deploy → Manage deployments → Edit → New version → Deploy
// ═════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────
// ⚙️ CONFIG — SIRF YAHAN CHANGE KAREIN (ek hi jagah)
// ─────────────────────────────────────────────────────────────────────
// FIX: Pehle ye 3 IDs har function ke andar ALAG SE hardcoded thi
// (4 jagah — kahin variable, kahin bilkul raw string). Is wajah se
// jab aap ek jagah ID change karte thay, baqi 3 jagah PURANI ID hi
// reh jati thi — aur script kabhi purani, kabhi nayi folder use karti
// thi (isi liye "kabhi kabhi purani shared folder" wala issue aa raha tha).
//
// AB: Sirf yahan neeche teeno values update karein — poori script
// automatically nayi value use karegi. Kahin aur ye IDs dobara mat likhein.
var MAIN_FOLDER_ID   = "1R-cQ1qYLat0DlnYKs699kXBX0zr7BZDP"; // Apni Drive ka MAIN folder ID (jahan client folders banti hain)
var TM1_TEMPLATE_ID  = "1XE42w12VjBMUW7jdvRU-HHdhmFd6yTB7HtL6H27FCnE"; // TM-1 Google Doc template ki ID
var TM48_TEMPLATE_ID = "1HyQyz-_tMFIy1X1bH0-sAToZmE2QJL5NFhGUwI_vLgE"; // TM-48 Google Doc template ki ID

// ─────────────────────────────────────────────────────────────────────
// CLASS / CONSULTANT MASTER DATA — mirrored from trademark-application.html
// ─────────────────────────────────────────────────────────────────────
// NOTE: Ye wahi CLASS_DATA/CONSULTANT_DATA arrays hain jo web form
// (trademark-application.html) mein bhi hain. Web form JavaScript mein
// chalta hai (browser), ye copy Apps Script (server) mein chalti hai —
// isi liye do jagah rakhni pariti hain. AGAR KABHI CLASS YA CONSULTANT
// LIST UPDATE KAREIN, DONO JAGAH (html + is file) UPDATE KAREIN.
var CLASS_DATA = [
  {n:1,type:'GOODS',desc:'Chemicals for use in industry, science and photography, as well as in agriculture, horticulture and forestry; unprocessed artificial resins, unprocessed plastics; fire extinguishing and fire prevention compositions; tempering and soldering preparations; substances for tanning animal skins and hides; adhesives for use in industry; putties and other paste fillers; compost, manures, fertilizers; biological preparations for use in industry and science.'},
  {n:2,type:'GOODS',desc:'Paints, varnishes, lacquers; preservatives against rust and against deterioration of wood; colorants, dyes; inks for printing, marking and engraving; raw natural resins; metals in foil and powder form for use in painting, decorating, printing and art.'},
  {n:3,type:'GOODS',desc:'Non-medicated cosmetics and toiletry preparations; non-medicated dentifrices; perfumery, essential oils; bleaching preparations and other substances for laundry use; cleaning, polishing and abrasive preparations.'},
  {n:4,type:'GOODS',desc:'Industrial oils and greases, wax; lubricants; dust absorbing, wetting and binding compositions; fuels and illuminants; candles and wicks for lighting.'},
  {n:5,type:'GOODS',desc:'Pharmaceuticals, medical and veterinary preparations; sanitary preparations for medical purposes; dietetic food and substances adapted for medical or veterinary use, food for babies; dietary supplements for human beings and animals; plasters, materials for dressings; material for stopping teeth, dental wax; disinfectants; preparations for destroying vermin; fungicides, herbicides.'},
  {n:6,type:'GOODS',desc:'Common metals and their alloys, ores; metal materials for building and construction; transportable buildings of metal; non-electric cables and wires of common metal; small items of metal hardware; metal containers for storage or transport; safes.'},
  {n:7,type:'GOODS',desc:'Machines, machine tools, power-operated tools; motors and engines, except for land vehicles; machine coupling and transmission components, except for land vehicles; agricultural implements, other than hand-operated hand tools; incubators for eggs; automatic vending machines.'},
  {n:8,type:'GOODS',desc:'Hand tools and implements, hand-operated; cutlery; side arms, except firearms; razors.'},
  {n:9,type:'GOODS',desc:'Scientific, research, navigation, surveying, photographic, cinematographic, audiovisual, optical, weighing, measuring, signalling, detecting, testing, inspecting, life-saving and teaching apparatus and instruments; apparatus and instruments for conducting, switching, transforming, accumulating, regulating or controlling the distribution or use of electricity; apparatus and instruments for recording, transmitting, reproducing or processing sound, images or data; recorded and downloadable media, computer software, blank digital or analogue recording and storage media; mechanisms for coin-operated apparatus; cash registers, calculating devices; computers and computer peripheral devices; diving suits, divers\' masks, ear plugs for divers, nose clips for divers and swimmers, gloves for divers, breathing apparatus for underwater swimming; fire-extinguishing apparatus.'},
  {n:10,type:'GOODS',desc:'Surgical, medical, dental and veterinary apparatus and instruments; artificial limbs, eyes and teeth; orthopaedic articles; suture materials; therapeutic and assistive devices adapted for persons with disabilities; massage apparatus; apparatus, devices and articles for nursing infants; sexual activity apparatus, devices and articles.'},
  {n:11,type:'GOODS',desc:'Apparatus and installations for lighting, heating, cooling, steam generating, cooking, drying, ventilating, water supply and sanitary purposes.'},
  {n:12,type:'GOODS',desc:'Vehicles; apparatus for locomotion by land, air or water.'},
  {n:13,type:'GOODS',desc:'Firearms; ammunition and projectiles; explosives; fireworks.'},
  {n:14,type:'GOODS',desc:'Precious metals and their alloys; jewellery, precious and semi-precious stones; horological and chronometric instruments.'},
  {n:15,type:'GOODS',desc:'Musical instruments; music stands and stands for musical instruments; conductors\' batons.'},
  {n:16,type:'GOODS',desc:'Paper and cardboard; printed matter; bookbinding material; photographs; stationery and office requisites, except furniture; adhesives for stationery or household purposes; drawing materials and materials for artists; paintbrushes; instructional and teaching materials; plastic sheets, films and bags for wrapping and packaging; printers\' type, printing blocks.'},
  {n:17,type:'GOODS',desc:'Unprocessed and semi-processed rubber, gutta-percha, gum, asbestos, mica and substitutes for all these materials; plastics and resins in extruded form for use in manufacture; packing, stopping and insulating materials; flexible pipes, tubes and hoses, not of metal.'},
  {n:18,type:'GOODS',desc:'Leather and imitations of leather; animal skins and hides; luggage and carrying bags; umbrellas and parasols; walking sticks; whips, harness and saddlery; collars, leashes and clothing for animals.'},
  {n:19,type:'GOODS',desc:'Materials, not of metal, for building and construction; rigid pipes, not of metal, for building; asphalt, pitch, tar and bitumen; transportable buildings, not of metal; monuments, not of metal.'},
  {n:20,type:'GOODS',desc:'Furniture, mirrors, picture frames; containers, not of metal, for storage or transport; unworked or semi-worked bone, horn, whalebone or mother-of-pearl; shells; meerschaum; yellow amber.'},
  {n:21,type:'GOODS',desc:'Household or kitchen utensils and containers; cookware and tableware, except forks, knives and spoons; combs and sponges; brushes, except paintbrushes; brush-making materials; articles for cleaning purposes; unworked or semi-worked glass, except building glass; glassware, porcelain and earthenware.'},
  {n:22,type:'GOODS',desc:'Ropes and string; nets; tents and tarpaulins; awnings of textile or synthetic materials; sails; sacks for the transport and storage of materials in bulk; padding, cushioning and stuffing materials, except of paper, cardboard, rubber or plastics; raw fibrous textile materials and substitutes therefor.'},
  {n:23,type:'GOODS',desc:'Yarns and threads for textile use.'},
  {n:24,type:'GOODS',desc:'Textiles and substitutes for textiles; household linen; curtains of textile or plastic.'},
  {n:25,type:'GOODS',desc:'Clothing, footwear, headwear.'},
  {n:26,type:'GOODS',desc:'Lace, braid and embroidery, and haberdashery ribbons and bows; buttons, hooks and eyes, pins and needles; artificial flowers; hair decorations; false hair.'},
  {n:27,type:'GOODS',desc:'Carpets, rugs, mats and matting, linoleum and other materials for covering existing floors; wall hangings, not of textile.'},
  {n:28,type:'GOODS',desc:'Games, toys and playthings; video game apparatus; gymnastic and sporting articles; decorations for Christmas trees.'},
  {n:29,type:'GOODS',desc:'Meat, fish, poultry and game; meat extracts; preserved, frozen, dried and cooked fruits and vegetables; jellies, jams, compotes; eggs; milk, cheese, butter, yogurt and other milk products; oils and fats for food.'},
  {n:30,type:'GOODS',desc:'Coffee, tea, cocoa and substitutes therefor; rice, pasta and noodles; tapioca and sago; flour and preparations made from cereals; bread, pastries and confectionery; chocolate; ice cream, sorbets and other edible ices; sugar, honey, treacle; yeast, baking powder; salt, seasonings, spices, preserved herbs; vinegar, sauces and other condiments; ice (frozen water).'},
  {n:31,type:'GOODS',desc:'Raw and unprocessed agricultural, aquacultural, horticultural and forestry products; raw and unprocessed grains and seeds; fresh fruits and vegetables, fresh herbs; natural plants and flowers; bulbs, seedlings and seeds for planting; live animals; foodstuffs and beverages for animals; malt.'},
  {n:32,type:'GOODS',desc:'Beers; non-alcoholic beverages; mineral and aerated waters; fruit beverages and fruit juices; syrups and other preparations for making non-alcoholic beverages.'},
  {n:33,type:'GOODS',desc:'Alcoholic beverages, except beers; alcoholic preparations for making beverages.'},
  {n:34,type:'GOODS',desc:'Tobacco and tobacco substitutes; cigarettes and cigars; electronic cigarettes and oral vaporizers for smokers; smokers\' articles; matches.'},
  {n:35,type:'SERVICES',desc:'Advertising; business management, organization and administration; office functions.'},
  {n:36,type:'SERVICES',desc:'Financial, monetary and banking services; insurance services; real estate services.'},
  {n:37,type:'SERVICES',desc:'Construction services; installation and repair services; mining extraction, oil and gas drilling.'},
  {n:38,type:'SERVICES',desc:'Telecommunications services.'},
  {n:39,type:'SERVICES',desc:'Transport; packaging and storage of goods; travel arrangement.'},
  {n:40,type:'SERVICES',desc:'Treatment of materials; recycling of waste and trash; air purification and treatment of water; printing services; food and drink preservation.'},
  {n:41,type:'SERVICES',desc:'Education; providing of training; entertainment; sporting and cultural activities.'},
  {n:42,type:'SERVICES',desc:'Scientific and technological services and research and design relating thereto; industrial analysis, industrial research and industrial design services; quality control and authentication services; design and development of computer hardware and software.'},
  {n:43,type:'SERVICES',desc:'Services for providing food and drink; temporary accommodation.'},
  {n:44,type:'SERVICES',desc:'Medical services; veterinary services; hygienic and beauty care for human beings or animals; agriculture, aquaculture, horticulture and forestry services.'},
  {n:45,type:'SERVICES',desc:'Legal services; security services for the physical protection of tangible property and individuals; dating services, online social networking services; funerary services; babysitting.'}
];

var CONSULTANT_DATA = [
  {name:"JAN ONLINE SERVICES/ADISTAAN", addr:"OPPOSITE GRASSY GROUND, SAIDU SHARIF, SWAT CELL # 0307-9118062, 0343-9832412"},
  {name:"BRANDEX LAW ASSOCIATES", addr:"DROP AT ABDULLAH CENTRE, JUNEJO COLONY BEHIND PTCL EXCHANGE, TARLAI, ISLAMABAD CELL # 03360015004"},
  {name:"NOOR BAAF LAW ASSOCIATES", addr:"PROPERTY NO.1284, CHOWK FAROOQ-E-AZAM, COLONY NO.1, KHANEWAL 03006339721"},
  {name:"AZIZ LAW ASSOCIATES", addr:"OFFICE NO 1, AL-GHURAIR GIGA PAKISTAN (PVT LTD), DHA 2, ISLAMABAD"},
  {name:"MS TAX & FINANCE CONSULTANT", addr:"OFFICE # FF-275 & FF-183, DEANS TRADE CENTER OPPOSITE STATE BANK PESHAWAR CANTT CELL # 03149090397, 03349027935"},
  {name:"MS BRAND EXPERTS (PVT.) LIMITED", addr:"OFFICE NO 06-07,1ST FLOOR, WALAYAT PLAZA REHMANABAD, MURREE ROAD, RAWALPINDI PHONE # 051-4932363"},
  {name:"KK CONSULTANT SMC-PVT LIMITED", addr:"LG 25, MIDCITY MALL, MURREE ROAD RWALPINDI. PH: 03349590247"},
  {name:"SHEIKH LAW ASSOCIATES", addr:"DROP AT ABDULLAH CENTRE, JUNEJO COLONY BEHIND PTCL EXCHANGE, TARLAI, ISLAMABAD CELL # +92 303 2200723"},
  {name:"M. TARIQ SHAIKH LAW FIRM", addr:"DROP AT ABDULLAH CENTRE, JUNEJO COLONY BEHIND PTCL EXCHANGE, TARLAI, ISLAMABAD CELL # 03360015004"},
  {name:"CONSULTANCYFIN", addr:"FLAT # D905, GREY NOOR TOWER, SCHEME 33, KARACHI"},
  {name:"M/S. SOLUTION LEGACY", addr:"F-173/2. MARTIN ROAD KARACHI PH +92 335 4522225"},
  {name:"M/S. BRAND EXPERTS (PVT.) LIMITED", addr:"OFFICE NO 06-07,1ST FLOOR, WALAYAT PLAZA REHMANABAD, MURREE ROAD, RAWALPINDI PHONE # 051-4932363"},
  {name:"S.A.T.H CONSULTANTS", addr:"DROP AT ABDULLAH CENTRE, JUNEJO COLONY BEHIND PTCL EXCHANGE, TARLAI, ISLAMABAD CELL # 03360015004"},
  {name:"BADAR CONSULTANTS", addr:"OPPOSITE GRASSY GROUND, SAIDU SHARIF, SWAT CELL # 0307-9118062, 0343-9832412"},
  {name:"MS HAFIZ M. ALI WARRAICH", addr:"DROP AT ABDULLAH CENTRE, JUNEJO COLONY BEHIND PTCL EXCHANGE, TARLAI, ISLAMABAD CELL # 03360015004"},
  {name:"TAXATIONIST CORPORATE CONSULTANTS", addr:"DROP AT ABDULLAH CENTRE, JUNEJO COLONY BEHIND PTCL EXCHANGE, TARLAI, ISLAMABAD CELL # 03360015004"},
  {name:"MUHAMMAD ADNAN BIN YOUSAF ASSOCIATES", addr:"OFFICE # 6, LOWER GROUND FLOOR, MEDIACOM TRADE CITY, JARANWALA ROAD, FAISALABAD 03006933982"}
];

// FILING PROCESS (Column V) — manual office-tracking status, independent
// of the automation's STATUS column (A). Never written by the script
// except as the default "PENDING" on a brand-new submission.
var FILING_PROCESS_OPTIONS = ["PENDING", "DISPATCHED 📬", "REVIEW", "REJECTED ❌"];


// ─────────────────────────────────────────────────────────────────────
// onEdit — Auto-fill trigger (Simple Trigger, runs automatically)
// ─────────────────────────────────────────────────────────────────────
// PURPOSE: Agar koi row seedha Sheet mein (web form ke bagair) bhari
// jaye, to CLASS (col G) ya CON-NAME (col R) select karte hi is se
// matching CLASS-DESC (col H) / CON-ADD (col S) khud-ba-khud bhar jati
// hai — bilkul web form jaisa behavior, ab Sheet ke andar bhi.
function onEdit(e) {
  try {
    var range = e.range;
    var sheet = range.getSheet();
    if (sheet.getName() !== "Sheet1") return;
    if (range.getNumRows() > 1 || range.getNumColumns() > 1) return; // ek waqt mein sirf single-cell edits handle karo

    var row = range.getRow();
    var col = range.getColumn();
    if (row < 2) return; // header row ignore

    if (col === 7) { // G = CLASS
      var classNum = parseInt(range.getValue().toString().replace(/\D/g, ""), 10);
      var match = CLASS_DATA.filter(function (c) { return c.n === classNum; })[0];
      sheet.getRange(row, 8).setValue(match ? match.desc.toUpperCase() : ""); // H = CLASS-DESC
    } else if (col === 18) { // R = CON-NAME
      var name = range.getValue().toString().trim();
      var found = CONSULTANT_DATA.filter(function (c) { return c.name === name; })[0];
      if (found) sheet.getRange(row, 19).setValue(found.addr); // S = CON-ADD
    }
  } catch (err) {
    Logger.log("onEdit error: " + err);
  }
}

// ─────────────────────────────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📋 TRADEMARK TOOLS') // NEW: sheet-related icon (pehle generic 🛠️ TOOLS tha)
    .addItem("📊 Setup Headers",    "setupSpreadsheet")
    .addItem("🔽 Setup Dropdowns",  "setupDropdowns")
    .addSeparator()
    .addItem("🎯 Process One",        "processOneApplication")
    .addToUi();
}


// ============================================================
// generateUniqueSerial — Batch Read (FAST)
// Format: PB-ISB-XXXXXXXXXXXXXXXXXX
// ============================================================
function generateUniqueSerial(sheet) {
  var prefix = "PB-ISB-";

  function makeRandom18() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result = "";
    for (var i = 0; i < 18; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  var lastRow = sheet.getLastRow();
  var existingSerials = {};

  if (lastRow >= 2) {
    var allSerials = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    allSerials.forEach(function(rowArr) {
      var val = rowArr[0];
      if (val) existingSerials[val.toString().trim()] = true;
    });
  }

  var attempts = 0;
  var newSerial;
  do {
    newSerial = prefix + makeRandom18();
    attempts++;
  } while (existingSerials[newSerial] && attempts < 10);

  return newSerial;
}


// ============================================================
// processAllApplications — Bulk
// ============================================================
function processAllApplications() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");

  // FIX: duplicate local ID declaration removed — ab MAIN_FOLDER_ID/TM1_TEMPLATE_ID/TM48_TEMPLATE_ID top ke CONFIG se aa rahi hain (ek hi jagah se).

  try {
    var lastRow = sheet.getLastRow();
    var processRows = [];

    for (var row = 2; row <= lastRow; row++) {
      var processStatus = sheet.getRange(row, 1).getValue();
      var triggerStatus = sheet.getRange(row, 2).getValue();

      if (
        processStatus && processStatus.toString().trim() === "START 💫" &&
        triggerStatus  && triggerStatus.toString().trim()  === "STAGE 1"
      ) {
        processRows.push(row);
      }
    }

    if (processRows.length === 0) {
      SpreadsheetApp.getUi().alert(
        "No Applications Found",
        "❌ Koi application nahi mili jis mein 'START 💫' aur 'STAGE 1' ho.",
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }

    var confirmMsg =
      "Found " + processRows.length + " applications.\n\nRows: " +
      processRows.join(", ") + "\n\nProceed?";
    var response = SpreadsheetApp.getUi().alert(
      "Confirm Bulk Processing", confirmMsg, SpreadsheetApp.getUi().ButtonSet.YES_NO
    );
    if (response !== SpreadsheetApp.getUi().Button.YES) return;

    var successCount = 0;
    var errorCount   = 0;

    for (var i = 0; i < processRows.length; i++) {
      var currentRow = processRows[i];
      try {
        sheet.getRange(currentRow, 1).setValue("ON IT 👉");
        SpreadsheetApp.flush();

        processRow(sheet, currentRow, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID);
        sheet.getRange(currentRow, 1).setValue("DONE ✅");
        successCount++;
      } catch (error) {
        Logger.log("❌ Row " + currentRow + " error: " + error.toString());
        // FIX: pehle yahan "START 💫" set hota tha — matlab lagta tha row
        // kabhi process hi nahi hui. Ab "ERROR ❌" set hoga taake failed
        // rows clearly nazar aayein aur "not-yet-started" rows se alag pehchani ja sakein.
        sheet.getRange(currentRow, 1).setValue("ERROR ❌");
        SpreadsheetApp.getUi().alert(
          "Error in Row " + currentRow,
          error.message,
          SpreadsheetApp.getUi().ButtonSet.OK
        );
        errorCount++;
      }

      if (i < processRows.length - 1) Utilities.sleep(500);
    }

    var summary =
      "✅ Processing Complete!\n\n" +
      "Successfully processed: " + successCount + "\n" +
      (errorCount > 0 ? "Errors: " + errorCount + "\n" : "") +
      "\nCheck your Drive folder for documents.";
    SpreadsheetApp.getUi().alert("Results", summary, SpreadsheetApp.getUi().ButtonSet.OK);

  } catch (error) {
    Logger.log("Critical error: " + error.toString());
    SpreadsheetApp.getUi().alert("Critical Error", "❌ " + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// ============================================================
// processOneApplication
// ============================================================
function processOneApplication() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");

  // FIX: duplicate local ID declaration removed — ab MAIN_FOLDER_ID/TM1_TEMPLATE_ID/TM48_TEMPLATE_ID top ke CONFIG se aa rahi hain (ek hi jagah se).

  try {
    var lastRow = sheet.getLastRow();
    for (var row = 2; row <= lastRow; row++) {
      var processStatus = sheet.getRange(row, 1).getValue();
      var triggerStatus = sheet.getRange(row, 2).getValue();

      if (
        processStatus && processStatus.toString().trim() === "START 💫" &&
        triggerStatus  && triggerStatus.toString().trim()  === "STAGE 1"
      ) {
        sheet.getRange(row, 1).setValue("ON IT 👉");
        SpreadsheetApp.flush();

        processRow(sheet, row, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID);
        sheet.getRange(row, 1).setValue("DONE ✅");

        SpreadsheetApp.getUi().alert(
          "Done",
          "✅ Row " + row + " successfully processed!",
          SpreadsheetApp.getUi().ButtonSet.OK
        );
        return;
      }
    }

    SpreadsheetApp.getUi().alert(
      "Not Found",
      "❌ Koi eligible application nahi mili.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    Logger.log("processOneApplication error: " + error.toString());
    // FIX: pehle yahan row ka status RESET NAHI hota tha — agar processRow()
    // beech mein fail ho jati, row hamesha "ON IT 👉" par hi atki reh jati thi,
    // aur lagta tha abhi bhi process ho raha hai. Ab clearly "ERROR ❌" set hoga.
    try {
      if (typeof row !== "undefined") sheet.getRange(row, 1).setValue("ERROR ❌");
    } catch (e2) {}
    SpreadsheetApp.getUi().alert("Error", "❌ " + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// ============================================================
// getOrCreateClientFolder — SHARED FIX
// ------------------------------------------------------------
// PURPOSE: Pehle ye function EXISTING folder (same naam) DHOONDTA
// hai. Agar mil jaye to WAHI reuse karta hai. Agar na mile, tab
// hi NAYI folder banata hai.
//
// KYUN ZAROORI HAI: Google Drive ka "createFolder()" kabhi bhi
// duplicate naam par ERROR nahi deta — ye chup chap ek ALAG NAYI
// folder bana deta hai, chahe usi naam ki folder pehle se maujood
// ho. Purane code mein "try { createFolder() } catch { find }"
// likha tha — lekin createFolder() kabhi throw hi nahi karta, is
// liye "catch" wala find-existing hissa kabhi chalta hi nahi tha.
// NATEEJA: har submission par ek NAYI duplicate-naam folder ban
// rahi thi, aur upload ki gayi image usi NAYI (duplicate) folder
// ke andar chali jati thi — jo folder aap check kar rahe thay
// (purani wali), uske andar kabhi image aati hi nahi thi.
// ============================================================
function getOrCreateClientFolder(parentFolder, rawFolderName) {
  // Drive folder names mein invalid characters (\ / : * ? " < > |)
  // sanitize kiye ja rahe hain — taake filename aur folder name
  // dono hamesha match karein.
  var folderName = (rawFolderName || "UNTITLED").toString()
    .replace(/[\\/:*?"<>|]/g, "_").trim();

  var existing = parentFolder.getFoldersByName(folderName);
  if (existing.hasNext()) {
    return existing.next(); // ✅ EXISTING folder reuse — koi duplicate nahi banega
  }
  return parentFolder.createFolder(folderName); // Sirf tab banao jab pehle se na ho
}


// ============================================================
// processRow — Sheet menu path (existing image ID from Col T)
// ============================================================
function processRow(sheet, row, mainFolderId, tm1TemplateId, tm48TemplateId) {
  try {
    var rowData = getRowData(sheet, row);
    validateRequiredData(rowData, row);

    if (!rowData.serialNo || rowData.serialNo.toString().trim() === "") {
      rowData.serialNo = generateUniqueSerial(sheet);
      sheet.getRange(row, 3).setValue(rowData.serialNo);
    }

    if (!rowData.date) {
      rowData.date = Utilities.formatDate(new Date(), "Asia/Karachi", "EEEE, dd MMMM yyyy");
      sheet.getRange(row, 6).setValue(rowData.date);
    }

    var parentFolder;
    try {
      parentFolder = DriveApp.getFolderById(mainFolderId);
      parentFolder.getName();
    } catch (folderErr) {
      throw new Error(
        "❌ MAIN FOLDER ID GALAT YA INACCESSIBLE HAI!\n" +
        "ID: " + mainFolderId + "\n" +
        "Row: " + row
      );
    }

    // FIX: ab getOrCreateClientFolder() use ho raha hai (upar dekhein)
    // taake purani wali GENERATED folder hi reuse ho, nayi duplicate na bane.
    var newFolder = getOrCreateClientFolder(parentFolder, rowData.folder);

    var tmImageBlob = getImageFromDriveId(rowData.img);
    generateDocuments(rowData, newFolder, tm1TemplateId, tm48TemplateId, tmImageBlob);

    Logger.log("✅ Row " + row + " processed: " + rowData.folder);
  } catch (error) {
    Logger.log("❌ processRow error row " + row + ": " + error.toString());
    throw error;
  }
}


// ============================================================
// getRowData
// ============================================================
function getRowData(sheet, row) {
  var range  = sheet.getRange(row, 1, 1, 21);
  var values = range.getValues()[0];

  var dateVal = values[5];
  if (dateVal instanceof Date) {
    dateVal = Utilities.formatDate(dateVal, "Asia/Karachi", "EEEE, dd MMMM yyyy");
  } else if (dateVal) {
    dateVal = dateVal.toString();
  }

  var issueDateVal = values[12];
  if (issueDateVal instanceof Date) {
    issueDateVal = Utilities.formatDate(issueDateVal, "Asia/Karachi", "dd-MMM-yyyy, hh:mm:ss a").toUpperCase();
  } else if (issueDateVal) {
    issueDateVal = issueDateVal.toString();
  }

  var expiryDateVal = values[13];
  if (expiryDateVal instanceof Date) {
    expiryDateVal = Utilities.formatDate(expiryDateVal, "Asia/Karachi", "dd-MMM-yyyy, hh:mm:ss a").toUpperCase();
  } else if (expiryDateVal) {
    expiryDateVal = expiryDateVal.toString();
  }

  var classNumber    = values[6] ? parseInt(values[6].toString().replace(/\D/g, "")) : 0;
  var goodsServices  = (classNumber >= 1 && classNumber <= 34) ? "GOODS" : "SERVICES";

  return {
    process:    values[0],
    trigger:    values[1],
    serialNo:   values[2],
    tm:         values[3],
    folder:     values[4],
    date:       dateVal,
    classNo:    values[6],
    classDesc:  values[7],
    appType:    values[8],
    appName:    values[9],
    appSo:      values[10],
    appCnic:    values[11],
    issueDate:  issueDateVal,
    expiryDate: expiryDateVal,
    appTrade:   values[14],
    appAdd:     values[15],
    year:       values[16],
    conName:    values[17],
    conAdd:     values[18],
    img:        values[19],
    noImg:      values[20] || "[NO IMAGE PROVIDED]",
    goodsServices: goodsServices
  };
}


function validateRequiredData(rowData, row) {
  var missing = [];
  if (!rowData.folder)  missing.push("FOLDER (Col E)");
  if (!rowData.classNo) missing.push("CLASS (Col G)");
  if (!rowData.appType) missing.push("APP-TYPE (Col I)");
  if (!rowData.appName) missing.push("APP-NAME (Col J)");

  if (missing.length > 0) {
    throw new Error("Row " + row + " — Missing: " + missing.join(", "));
  }
}


function getImageFromDriveId(imageId) {
  try {
    if (!imageId || imageId.toString().trim() === "") return null;

    var cleanId = imageId.toString().trim();

    if (cleanId.indexOf("drive.google.com") !== -1) {
      var match = cleanId.match(/[-\w]{25,}/);
      if (match) cleanId = match[0];
      else return null;
    }

    var file     = DriveApp.getFileById(cleanId);
    var mimeType = file.getMimeType();

    if (!mimeType.startsWith("image/")) return null;

    return file.getBlob();
  } catch (error) {
    Logger.log("❌ getImageFromDriveId error: " + error.toString());
    return null;
  }
}


function generateDocuments(rowData, folder, tm1TemplateId, tm48TemplateId, imageBlob) {
  var mergeData = {
    "{{SERIAL}}":        rowData.serialNo    || "",
    "{{TM}}":            rowData.tm          || "",
    "{{CLASS}}":         rowData.classNo     || "",
    "{{CLASS_DESC}}":    rowData.classDesc   || "",
    "{{APP_TYPE}}":      rowData.appType     || "",
    "{{APP_NAME}}":      rowData.appName     || "",
    "{{APP_SO}}":        rowData.appSo       || "",
    "{{APP_CNIC}}":      rowData.appCnic     || "",
    "{{ISSUE_DATE}}":    rowData.issueDate   || "",
    "{{EXPIRY_DATE}}":   rowData.expiryDate  || "",
    "{{APP_TRADE}}":     rowData.appTrade    || "",
    "{{APP_ADD}}":       rowData.appAdd      || "",
    "{{YEAR}}":          rowData.year        || "",
    "{{CON_NAME}}":      rowData.conName     || "",
    "{{CON_ADD}}":       rowData.conAdd      || "",
    "{{GOODS_SERVICES}}":rowData.goodsServices,
    "{{DATE}}":          rowData.date        || "",
    "{{FOLDER}}":        rowData.folder      || ""
  };

  if (tm1TemplateId) {
    generateWordDoc(
      tm1TemplateId, folder, rowData.folder + " - TM-1",
      mergeData, imageBlob, "{{IMAGE}}", rowData.noImg, "TM1_TEMPLATE_ID"
    );
  }

  if (tm48TemplateId) {
    generateWordDoc(
      tm48TemplateId, folder, rowData.folder + " - TM-48",
      mergeData, imageBlob, "{{IMAGE}}", rowData.noImg, "TM48_TEMPLATE_ID"
    );
  }
}


function generateWordDoc(templateId, folder, docName, mergeData, imageBlob, imagePlaceholder, fallbackText, templateLabel) {
  try {
    var templateFile;
    try {
      templateFile = DriveApp.getFileById(templateId);
    } catch (templateErr) {
      throw new Error(
        "❌ TEMPLATE ID GALAT YA INACCESSIBLE HAI!\n" +
        "Template: " + (templateLabel || "UNKNOWN") + "\n" +
        "ID: " + templateId
      );
    }

    var doc      = templateFile.makeCopy(docName, folder);
    var document = DocumentApp.openById(doc.getId());
    var body     = document.getBody();

    for (var key in mergeData) {
      body.replaceText(escapeRegex(key), (mergeData[key] || "").toString());
    }

    if (imageBlob) {
      var imageInserted = replaceTextWithImage(body, imagePlaceholder, imageBlob);
      if (!imageInserted) {
        body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[IMAGE FAILED]");
      }
    } else {
      body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[NO IMAGE PROVIDED]");
    }

    document.saveAndClose();
    Logger.log("✅ Generated: " + docName);
  } catch (error) {
    Logger.log("❌ generateWordDoc failed [" + docName + "]: " + error.toString());
    throw error;
  }
}


function replaceTextWithImage(body, placeholder, imageBlob) {
  try {
    var searchResult = body.findText(escapeRegex(placeholder));
    if (!searchResult) return false;

    var textElement = searchResult.getElement();
    var parent      = textElement.getParent();
    var childIndex  = parent.getChildIndex(textElement);

    parent.removeChild(textElement);
    var image = parent.insertInlineImage(childIndex, imageBlob);
    image.setWidth(200);
    image.setHeight(200);
    return true;
  } catch (error) {
    Logger.log("❌ replaceTextWithImage error: " + error.toString());
    return false;
  }
}


function escapeRegex(str) {
  return str.replace(/[{}]/g, "\\$&");
}


function setupSpreadsheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var headers = [
    "STATUS", "STAGE", "SR NO", "TM-NO", "NAME", "DATE L",
    "CLASS", "CLASS-DESC", "APP-TYPE", "APP-NAME",
    "APP-SO", "APP-CNIC", "ISSUE-DATE", "EXPIRY-DATE",
    "APP-TRADE", "APP-ADD", "YEAR", "CON-NAME", "CON-ADD",
    "IMG", "NO-IMG",
    "FILING PROCESS" // NEW: column V — manual office tracking (see FILING_PROCESS_OPTIONS)
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // ── Heading style ──
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground("#1a1a2e").setFontColor("#e94560").setFontWeight("bold")
    .setFontFamily("Ysabeau SC"); // heading font
  sheet.setFrozenRows(1);

  // ── Body style: font + left align + clip (no wrap, no overflow) ──
  var maxRows = Math.max(sheet.getMaxRows(), 500);
  var bodyRange = sheet.getRange(2, 1, maxRows - 1, headers.length);
  bodyRange
    .setFontFamily("Times New Roman")
    .setHorizontalAlignment("left")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  // ── Conditional formatting: ERROR ❌ row → light red ──
  var errorRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$A2="ERROR ❌"')
    .setBackground("#fde2e2") // light red
    .setRanges([sheet.getRange(2, 1, maxRows - 1, headers.length)])
    .build();
  var rules = sheet.getConditionalFormatRules().filter(function (r) {
    // purane isi tarah ke rule ko dobara add hone se roko (Setup Headers dobara chalane par)
    return r.getRanges()[0].getA1Notation() !== errorRule.getRanges()[0].getA1Notation();
  });
  rules.push(errorRule);
  sheet.setConditionalFormatRules(rules);

  sheet.toast("Headers, fonts, aur ERROR row-highlight set ho gaye.", "✅ Setup Complete", 5);
}


function setupDropdowns() {
  var sheet   = SpreadsheetApp.getActiveSheet();
  var lastRow = Math.max(sheet.getLastRow(), 100);
  try {
    sheet.getRange(2, 1, lastRow - 1, 1).setDataValidation(
      // FIX: "ERROR ❌" add ki gayi — ab fail hone par row is status par
      // clearly ruk jayegi, na ke "ON IT" par atki rahegi ya chup chap
      // "START" par wapas chali jaye.
      SpreadsheetApp.newDataValidation().requireValueInList(["START 💫", "ON IT 👉", "DONE ✅", "ERROR ❌"]).setAllowInvalid(false).build()
    );
    sheet.getRange(2, 2, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(["STAGE 1"]).setAllowInvalid(false).build()
    );

    // NEW: CLASS (col G) — sirf valid Nice Classification numbers (1–45).
    // Select karte hi onEdit() trigger CLASS-DESC (col H) khud bhar dega.
    var classNumbers = CLASS_DATA.map(function (c) { return c.n.toString(); });
    sheet.getRange(2, 7, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(classNumbers).setAllowInvalid(false).build()
    );

    sheet.getRange(2, 9, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(["SOLE PROPRIETOR", "PARTNERS", "A PAKISTANI COMPANY"]).setAllowInvalid(false).build()
    );
    sheet.getRange(2, 17, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(["2022", "2023", "2024", "2025", "2026"]).setAllowInvalid(false).build()
    );

    // NEW: CON-NAME (col R) — list ke consultants suggest karta hai, lekin
    // manual/naya consultant bhi type kiya ja sakta hai (allowInvalid: true).
    // Select karte hi onEdit() trigger CON-ADD (col S) khud bhar dega.
    var consultantNames = CONSULTANT_DATA.map(function (c) { return c.name; });
    sheet.getRange(2, 18, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(consultantNames).setAllowInvalid(true).build()
    );

    // NEW: FILING PROCESS (col V) — manual office tracking dropdown.
    sheet.getRange(2, 22, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(FILING_PROCESS_OPTIONS).setAllowInvalid(false).build()
    );

    sheet.toast("Sab dropdowns (CLASS, CONSULTANT, FILING PROCESS samet) set ho gaye.", "✅ Dropdowns Ready", 5);
  } catch (error) {
    SpreadsheetApp.getUi().alert("Error", "❌ " + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}


// FIX: "Upload TM Image" sidebar tool (showImageUploader + uploadToDrive +
// writeImageIdToSheet) yahan se HATA DIYA GAYA hai — client ke mutabiq
// ab sheet mein manual kaam nahi hota, sab kuch web form se hota hai.
// Ye purani sidebar bhi asal mein image ko MAIN folder ke root mein daalti
// thi (client folder ke andar nahi) — is liye inconsistent bhi thi.
// Agar kabhi dobara zaroorat pare, purani copy Claude conversation history
// mein maujood hai.


// ═════════════════════════════════════════════════════════════════════
// WEB FORM HANDLER (doPost)
// Image is saved INSIDE the generated client folder as FOLDERNAME_logo.ext
// ═════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");

    if (body.action === "generateFromForm") {
      var result = processFormSubmission(body);
      return jsonResponse({
        ok: true,
        serialNo: result.serialNo,
        row: result.row,
        folderUrl: result.folderUrl,
        tm1Url: result.tm1Url,
        tm48Url: result.tm48Url,
        imageWarning: result.imageWarning || "" // FIX: frontend ab is field ko dikha sakta hai
      });
    }

    return jsonResponse({ ok: false, error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function processFormSubmission(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Sheet1");
  if (!sheet) throw new Error("Sheet1 not found");

  // FIX: duplicate local ID declaration removed — ab MAIN_FOLDER_ID/TM1_TEMPLATE_ID/TM48_TEMPLATE_ID top ke CONFIG se aa rahi hain (ek hi jagah se).

  var lastRow = sheet.getLastRow() + 1;
  var serial  = generateUniqueSerial(sheet);
  var today   = Utilities.formatDate(new Date(), "Asia/Karachi", "EEEE, dd MMMM yyyy");

  var rowValues = [
    "START 💫", "STAGE 1", serial,
    data.tm || "", data.folder || "", today,
    data.classNo || "", data.classDesc || "", data.appType || "",
    data.appName || "", data.appSo || "", data.appCnic || "",
    data.issueDate || "", data.expiryDate || "", data.appTrade || "",
    data.appAdd || "", data.year || "", data.conName || "", data.conAdd || "",
    "", // T - imageId filled after upload into client folder
    data.noImg || "[NO IMAGE PROVIDED]",
    "PENDING" // V - FILING PROCESS: har naye submission par default "PENDING", office staff manually update karta hai
  ];
  sheet.getRange(lastRow, 1, 1, 22).setValues([rowValues]);

  sheet.getRange(lastRow, 1).setValue("ON IT 👉");
  SpreadsheetApp.flush();

  // FIX: pehle agar processRowAndReturnLinks() beech mein fail ho jati
  // (missing field, folder issue, wagera), row hamesha "ON IT 👉" par
  // hi atki reh jati thi — dikhta tha jese abhi bhi process ho raha hai,
  // jabke woh fail ho chuki hoti thi. Ab clearly "ERROR ❌" set hoga.
  var processResult;
  try {
    processResult = processRowAndReturnLinks(
      sheet, lastRow, MAIN_FOLDER_ID, TM1_TEMPLATE_ID, TM48_TEMPLATE_ID, data
    );
  } catch (procErr) {
    sheet.getRange(lastRow, 1).setValue("ERROR ❌");
    throw procErr; // doPost() ka catch ise pakar kar frontend ko error dikha dega
  }

  sheet.getRange(lastRow, 1).setValue("DONE ✅");

  return {
    serialNo: serial,
    row: lastRow,
    folderUrl: processResult.folderUrl,
    tm1Url: processResult.tm1Url,
    tm48Url: processResult.tm48Url,
    imageWarning: processResult.imageWarning // FIX: forward to doPost()
  };
}

function processRowAndReturnLinks(sheet, row, mainFolderId, tm1TemplateId, tm48TemplateId, formData) {
  var rowData = getRowData(sheet, row);
  validateRequiredData(rowData, row);

  if (!rowData.serialNo || rowData.serialNo.toString().trim() === "") {
    rowData.serialNo = generateUniqueSerial(sheet);
    sheet.getRange(row, 3).setValue(rowData.serialNo);
  }
  if (!rowData.date) {
    rowData.date = Utilities.formatDate(new Date(), "Asia/Karachi", "EEEE, dd MMMM yyyy");
    sheet.getRange(row, 6).setValue(rowData.date);
  }

  var parentFolder = DriveApp.getFolderById(mainFolderId);
  // FIX: getOrCreateClientFolder() pehle EXISTING folder dhoondta hai,
  // sirf na milne par NAYI banata hai — is se duplicate-naam folders
  // banna band ho jayenge aur image hamesha SAHI (asal) folder mein jayegi.
  var newFolder = getOrCreateClientFolder(parentFolder, rowData.folder);

  // ========== IMAGE → CLIENT FOLDER + FOLDER NAME AS FILENAME ==========
  var imageId = "";
  var tmImageBlob = null;
  var imageWarning = ""; // FIX: agar image save fail ho to ye user tak jayega (pehle sirf Logger mein chup jata tha)

  if (formData && formData.imageBase64) {
    try {
      var base64 = formData.imageBase64.split(",")[1];
      var bytes  = Utilities.base64Decode(base64);
      var ext = "jpg";
      if (formData.imageMime) {
        if (formData.imageMime.indexOf("png") !== -1) ext = "png";
        else if (formData.imageMime.indexOf("gif") !== -1) ext = "gif";
        else if (formData.imageMime.indexOf("webp") !== -1) ext = "webp";
      }
      var safeName = (rowData.folder || "trademark").toString().replace(/[\\/:*?"<>|]/g, "_").trim();
      var imageFileName = safeName + "_logo." + ext;

      var blob = Utilities.newBlob(bytes, formData.imageMime || "image/jpeg", imageFileName);
      var file = newFolder.createFile(blob); // INSIDE client folder
      // FIX (confidentiality + speed): pehle yahan file.setSharing(ANYONE_WITH_LINK)
      // call hoti thi — matlab client ka trademark logo "kisi bhi link rakhne
      // wale" ke liye public view-able ban jata tha, filing se pehle hi. Ye
      // ek IP-confidentiality risk hai aur ek extra Drive API call (thora slow
      // bhi karta hai). Image doc ke andar embed ho hi jati hai — is liye
      // alag se public sharing ki zaroorat nahi. Hata diya.
      imageId = file.getId();
      tmImageBlob = blob;
      sheet.getRange(row, 20).setValue(imageId); // Col T

      Logger.log("✅ Image saved INSIDE client folder: " + newFolder.getName() +
                 " | File: " + imageFileName + " | ID: " + imageId);
    } catch (imgErr) {
      // FIX: ab error sirf Logger mein chup nahi jayega — ye variable
      // return value ke through frontend tak pohanchega (neeche return statement dekhein).
      imageWarning = "⚠️ Image upload folder ke andar save NAHI ho saki: " + imgErr;
      Logger.log("❌ Image upload failed: " + imgErr);
    }
  } else if (rowData.img) {
    tmImageBlob = getImageFromDriveId(rowData.img);
  }
  // ======================================================================

  var mergeData = {
    "{{SERIAL}}": rowData.serialNo || "",
    "{{TM}}": rowData.tm || "",
    "{{CLASS}}": rowData.classNo || "",
    "{{CLASS_DESC}}": rowData.classDesc || "",
    "{{APP_TYPE}}": rowData.appType || "",
    "{{APP_NAME}}": rowData.appName || "",
    "{{APP_SO}}": rowData.appSo || "",
    "{{APP_CNIC}}": rowData.appCnic || "",
    "{{ISSUE_DATE}}": rowData.issueDate || "",
    "{{EXPIRY_DATE}}": rowData.expiryDate || "",
    "{{APP_TRADE}}": rowData.appTrade || "",
    "{{APP_ADD}}": rowData.appAdd || "",
    "{{YEAR}}": rowData.year || "",
    "{{CON_NAME}}": rowData.conName || "",
    "{{CON_ADD}}": rowData.conAdd || "",
    "{{GOODS_SERVICES}}": rowData.goodsServices,
    "{{DATE}}": rowData.date || "",
    "{{FOLDER}}": rowData.folder || ""
  };

  var tm1Doc = null, tm48Doc = null;
  if (tm1TemplateId) {
    tm1Doc = generateWordDocReturn(tm1TemplateId, newFolder, rowData.folder + " - TM-1",
      mergeData, tmImageBlob, "{{IMAGE}}", rowData.noImg, "TM1_TEMPLATE_ID");
  }
  if (tm48TemplateId) {
    tm48Doc = generateWordDocReturn(tm48TemplateId, newFolder, rowData.folder + " - TM-48",
      mergeData, tmImageBlob, "{{IMAGE}}", rowData.noImg, "TM48_TEMPLATE_ID");
  }

  return {
    folderUrl: newFolder.getUrl(),
    tm1Url: tm1Doc ? tm1Doc.getUrl() : null,
    tm48Url: tm48Doc ? tm48Doc.getUrl() : null,
    imageWarning: imageWarning // FIX: empty string agar sab theek, warna warning message
  };
}

function generateWordDocReturn(templateId, folder, docName, mergeData, imageBlob, imagePlaceholder, fallbackText, templateLabel) {
  var templateFile = DriveApp.getFileById(templateId);
  var doc = templateFile.makeCopy(docName, folder);
  var document = DocumentApp.openById(doc.getId());
  var body = document.getBody();

  for (var key in mergeData) {
    body.replaceText(escapeRegex(key), (mergeData[key] || "").toString());
  }

  if (imageBlob) {
    var inserted = replaceTextWithImage(body, imagePlaceholder, imageBlob);
    if (!inserted) {
      body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[IMAGE FAILED]");
    }
  } else {
    body.replaceText(escapeRegex(imagePlaceholder), fallbackText || "[NO IMAGE PROVIDED]");
  }

  document.saveAndClose();
  return doc;
}
