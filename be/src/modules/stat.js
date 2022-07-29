import path from "path";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import "../configs/mongoose.config";
import Models from "../models";
import fs from "fs";
import axios from "axios";
import bluebird, { Promise } from "bluebird";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csvtojson");
import CoreNLP, { Properties, Pipeline } from "corenlp";
import _ from "lodash";
var w2v = require("word2vec");
var w2vModel;
var w2vModelData = {};
const comment =
  "Do not use this app, it is full of scammers. All they want you to do is take their word for how great the room is send you some generic pictures and ask for your security deposit without getting to see the room.";
const permissionTypes = {
  Telephony: [
    "android.permission.ACCEPT_HANDOVER",
    "com.android.voicemail.permission.ADD_VOICEMAIL",
    "android.permission.ANSWER_PHONE_CALLS",
    "android.permission.CALL_PHONE",
    "android.permission.GET_ACCOUNTS",
    "android.permission.PROCESS_OUTGOING_CALLS",
    "android.permission.READ_CALL_LOG",
    "android.permission.READ_CONTACTS",
    "android.permission.READ_PHONE_NUMBERS",
    "android.permission.READ_PHONE_STATE",
    "android.permission.READ_SMS",
    "android.permission.RECEIVE_MMS",
    "android.permission.RECEIVE_SMS",
    "android.permission.RECEIVE_WAP_PUSH",
    "android.permission.SEND_SMS",
    "android.permission.USE_SIP",
    "android.permission.WRITE_CALL_LOG",
    "android.permission.WRITE_CONTACTS"
  ],
  Location: [
    "android.permission.ACCESS_BACKGROUND_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_MEDIA_LOCATION"
  ],
  Fitness: [
    // Health&Fitness
    "android.permission.ACTIVITY_RECOGNITION",
    "android.permission.BODY_SENSORS"
  ],
  Connection: [
    "android.permission.BLUETOOTH_ADVERTISE",
    "android.permission.BLUETOOTH_CONNECT",
    "android.permission.BLUETOOTH_SCAN",
    "android.permission.UWB_RANGING"
  ],
  Hardware: ["android.permission.CAMERA"],
  Calendar: ["android.permission.READ_CALENDAR", "android.permission.WRITE_CALENDAR"],
  Storage: [
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE"
  ],
  Media: ["android.permission.RECORD_AUDIO"]
};
const dataCollectionTypes = {
  Connection: [
    "Bluetooth",
    "Companion devices",
    "Connectivity status",
    "DNS",
    "Inet",
    "IP",
    "Link",
    "Socket",
    "MAC",
    "Mailto",
    "Network type",
    "Proxy",
    "Route",
    "SSL",
    "URI",
    "VPN",
    "HTTP",
    "NSD",
    "RTP",
    "SIP",
    "Wifi",
    "NFC",
    "URL",
    "Cookie",
    "Authenticator",
    "IDN",
    "Cache"
  ],
  Hardware: [
    "Camera",
    "Flash",
    "Buffer",
    "Accelerometer sensor",
    "Temperature sensor",
    "Other sensors",
    "Gyroscope sensor",
    "Heart beat sensor",
    "Heart rate sensor",
    "Light sensor",
    "Acceleration sensor",
    "Location sensor",
    "Biometric",
    "Device model",
    "Lens",
    "Screen",
    "Display",
    "Fingerprint",
    "Hardware type",
    "Keyboard",
    "USB",
    "IMEI"
  ],
  Fitness: [
    // Health&Fitness
    "Bluetooth device",
    "Google Fit",
    "Fitness activity",
    "Time",
    "Glucose",
    "Blood pressure",
    "Body position",
    "Body tempurature",
    "Cervical",
    "Meal",
    "Menstrual flow",
    "Ovulation",
    "Oxygen",
    "Sleep"
  ],
  Location: [
    "Latitude",
    "Longitude",
    "Address",
    "Country",
    "Local name",
    "Locale",
    "Postal code",
    "Criteria",
    "Geographic",
    "Local time",
    "Measurement",
    "Navigation",
    "GPS",
    "Longitude, Latitude",
    "Destination",
    "Location type",
    "Distance",
    "Accuracy",
    "Speed",
    "Altitude",
    "Bearing",
    "NMEA",
    "Locale name",
    "Position",
    "Location activity",
    "Vehicle",
    "Duration",
    "Maps",
    "Places",
    "Location name",
    "Phone number"
  ],
  Media: [
    "Audio",
    "Image",
    "Player",
    "Video",
    "Recorder",
    "Scanner",
    "Microphone",
    "Remote",
    "Movie",
    "Music",
    "Channels",
    "Volume",
    "Device info",
    "Audio manager",
    "HDMI",
    "Sound",
    "Playback",
    "Headphone",
    "Presentation",
    "Media type",
    "Timestamp",
    "Audio track",
    "Video quality",
    "Camera",
    "Interface",
    "Length",
    "Face detector",
    "Media Cas",
    "Session",
    "Codec",
    "Callback",
    "Color",
    "Feature",
    "Profile",
    "Encoder",
    "Controller",
    "Media description",
    "Media ID",
    "Media name",
    "DRM",
    "Key",
    "Media format",
    "Metadata",
    "Muxer",
    "Players",
    "Voice",
    "Router",
    "Display",
    "Media connection",
    "Sync",
    "Rating",
    "Ringtone",
    "TONE",
    "Processing",
    "Environtmental",
    "Equalizer",
    "Virtualizer",
    "Browser",
    "Effect",
    "Midi",
    "Projection",
    "TV",
    "Preview",
    "Program",
    "Flash",
    "GPS",
    "Speed",
    "Lens",
    "Light",
    "Adapter",
    "HTTP",
    "Sensor",
    "Widget"
  ],
  Telephony: [
    "MMS",
    "SMS",
    "ThreadsColumns",
    "Carrier",
    "Service",
    "Network type",
    "MNC",
    "Roaming",
    "Cell",
    "ICC",
    "Session",
    "Phone number",
    "Phone status",
    "Subscription",
    "Telephony manager",
    "Callback",
    "UICC",
    "Voicemail",
    "APN",
    "EUICC",
    "Download",
    "File info",
    "Group call",
    "MBMS"
  ],
  Info: [
    // UserInfo
    "Account",
    "Name",
    "Contact",
    "User profile",
    "Address",
    "Age",
    "Bigraphy",
    "Birthdays",
    "Email",
    "Gender",
    "Organizations",
    "Bigraphic",
    "Nickname",
    "Occupation",
    "Phone number",
    "SIP",
    "URL"
  ]
};
const dataTypes = {
  Connection: [
    "Bluetooth",
    "Companion devices",
    "Connectivity status",
    "DNS",
    "Inet",
    "IP",
    "Link",
    "Socket",
    "MAC",
    "Mailto",
    "Network type",
    "Proxy",
    "Route",
    "SSL",
    "URI",
    "VPN",
    "HTTP",
    "NSD",
    "RTP",
    "SIP",
    "Wifi",
    "NFC",
    "URL",
    "Cookie",
    "Authenticator",
    "IDN",
    "Cache"
  ],
  Hardware: [
    "Camera",
    "Flash",
    "Buffer",
    "Accelerometer sensor",
    "Temperature sensor",
    "Other sensors",
    "Gyroscope sensor",
    "Heart beat sensor",
    "Heart rate sensor",
    "Light sensor",
    "Acceleration sensor",
    "Location sensor",
    "Biometric",
    "Device model",
    "Lens",
    "Screen",
    "Display",
    "Fingerprint",
    "Hardware type",
    "Keyboard",
    "USB",
    "IMEI"
  ],
  "Health&Fitness": [
    "Bluetooth device",
    "Google Fit",
    "Fitness activity",
    "Time",
    "Glucose",
    "Blood pressure",
    "Body position",
    "Body tempurature",
    "Cervical",
    "Meal",
    "Menstrual flow",
    "Ovulation",
    "Oxygen",
    "Sleep"
  ],
  Location: [
    "Latitude",
    "Longitude",
    "Address",
    "Country",
    "Local name",
    "Locale",
    "Postal code",
    "Criteria",
    "Geographic",
    "Local time",
    "Measurement",
    "Navigation",
    "GPS",
    "Longitude, Latitude",
    "Destination",
    "Location type",
    "Distance",
    "Accuracy",
    "Speed",
    "Altitude",
    "Bearing",
    "NMEA",
    "Locale name",
    "Position",
    "Location activity",
    "Vehicle",
    "Duration",
    "Maps",
    "Places",
    "Location name",
    "Phone number"
  ],
  Media: [
    "Audio",
    "Image",
    "Player",
    "Video",
    "Recorder",
    "Scanner",
    "Microphone",
    "Remote",
    "Movie",
    "Music",
    "Channels",
    "Volume",
    "Device info",
    "Audio manager",
    "HDMI",
    "Sound",
    "Playback",
    "Headphone",
    "Presentation",
    "Media type",
    "Timestamp",
    "Audio track",
    "Video quality",
    "Camera",
    "Interface",
    "Length",
    "Face detector",
    "Media Cas",
    "Session",
    "Codec",
    "Callback",
    "Color",
    "Feature",
    "Profile",
    "Encoder",
    "Controller",
    "Media description",
    "Media ID",
    "Media name",
    "DRM",
    "Key",
    "Media format",
    "Metadata",
    "Muxer",
    "Players",
    "Voice",
    "Router",
    "Display",
    "Media connection",
    "Sync",
    "Rating",
    "Ringtone",
    "TONE",
    "Processing",
    "Environtmental",
    "Equalizer",
    "Virtualizer",
    "Browser",
    "Effect",
    "Midi",
    "Projection",
    "TV",
    "Preview",
    "Program",
    "Flash",
    "GPS",
    "Speed",
    "Lens",
    "Light",
    "Adapter",
    "HTTP",
    "Sensor",
    "Widget"
  ],
  Telephony: [
    "MMS",
    "SMS",
    "ThreadsColumns",
    "Carrier",
    "Service",
    "Network type",
    "MNC",
    "Roaming",
    "Cell",
    "ICC",
    "Session",
    "Phone number",
    "Phone status",
    "Subscription",
    "Telephony manager",
    "Callback",
    "UICC",
    "Voicemail",
    "APN",
    "EUICC",
    "Download",
    "File info",
    "Group call",
    "MBMS"
  ],
  UserInfo: [
    "Account",
    "Name",
    "Contact",
    "User profile",
    "Address",
    "Age",
    "Bigraphy",
    "Birthdays",
    "Email",
    "Gender",
    "Organizations",
    "Bigraphic",
    "Nickname",
    "Occupation",
    "Phone number",
    "SIP",
    "URL"
  ]
};
const DATA_TYPES = [
  "Bluetooth",
  "Companion devices",
  "Connectivity status",
  "DNS",
  "Inet",
  "IP",
  "Link",
  "Socket",
  "MAC",
  "Mailto",
  "Network type",
  "Proxy",
  "Route",
  "SSL",
  "URI",
  "VPN",
  "HTTP",
  "NSD",
  "RTP",
  "SIP",
  "Wifi",
  "NFC",
  "URL",
  "Cookie",
  "Authenticator",
  "IDN",
  "Cache",
  "Camera",
  "Flash",
  "Buffer",
  "Accelerometer sensor",
  "Temperature sensor",
  "Other sensors",
  "Gyroscope sensor",
  "Heart beat sensor",
  "Heart rate sensor",
  "Light sensor",
  "Acceleration sensor",
  "Location sensor",
  "Biometric",
  "Device model",
  "Lens",
  "Screen",
  "Display",
  "Fingerprint",
  "Hardware type",
  "Keyboard",
  "USB",
  "IMEI",
  "Bluetooth device",
  "Google Fit",
  "Fitness activity",
  "Time",
  "Glucose",
  "Blood pressure",
  "Body position",
  "Body tempurature",
  "Cervical",
  "Meal",
  "Menstrual flow",
  "Ovulation",
  "Oxygen",
  "Sleep",
  "Latitude",
  "Longitude",
  "Address",
  "Country",
  "Local name",
  "Locale",
  "Postal code",
  "Criteria",
  "Geographic",
  "Local time",
  "Measurement",
  "Navigation",
  "GPS",
  "Longitude, Latitude",
  "Destination",
  "Location type",
  "Distance",
  "Accuracy",
  "Speed",
  "Altitude",
  "Bearing",
  "NMEA",
  "Locale name",
  "Position",
  "Location activity",
  "Vehicle",
  "Duration",
  "Maps",
  "Places",
  "Location name",
  "Phone number",
  "Audio",
  "Image",
  "Player",
  "Video",
  "Recorder",
  "Scanner",
  "Microphone",
  "Remote",
  "Movie",
  "Music",
  "Channels",
  "Volume",
  "Device info",
  "Audio manager",
  "HDMI",
  "Sound",
  "Playback",
  "Headphone",
  "Presentation",
  "Media type",
  "Timestamp",
  "Audio track",
  "Video quality",
  "Interface",
  "Length",
  "Face detector",
  "Media Cas",
  "Session",
  "Codec",
  "Callback",
  "Color",
  "Feature",
  "Profile",
  "Encoder",
  "Controller",
  "Media description",
  "Media ID",
  "Media name",
  "DRM",
  "Key",
  "Media format",
  "Metadata",
  "Muxer",
  "Players",
  "Voice",
  "Router",
  "Media connection",
  "Sync",
  "Rating",
  "Ringtone",
  "TONE",
  "Processing",
  "Environtmental",
  "Equalizer",
  "Virtualizer",
  "Browser",
  "Effect",
  "Midi",
  "Projection",
  "TV",
  "Preview",
  "Program",
  "Light",
  "Adapter",
  "Sensor",
  "Widget",
  "MMS",
  "SMS",
  "ThreadsColumns",
  "Carrier",
  "Service",
  "MNC",
  "Roaming",
  "Cell",
  "ICC",
  "Phone status",
  "Subscription",
  "Telephony manager",
  "UICC",
  "Voicemail",
  "APN",
  "EUICC",
  "Download",
  "File info",
  "Group call",
  "MBMS",
  "Account",
  "Name",
  "Contact",
  "User profile",
  "Age",
  "Bigraphy",
  "Birthdays",
  "Email",
  "Gender",
  "Organizations",
  "Bigraphic",
  "Nickname",
  "Occupation"
];
const PERMISSIONS = [
  "Calendar",
  "Connection",
  "Media",
  "Storage",
  "Telephony",
  "Location",
  "Fitness",
  "Hardware"
];
const THIRD_PARTIES = [
  "a.applovin.com",
  "aarki.net",
  "active.mobi",
  "adactioninteractive.com",
  "Adcolony",
  "addthis.com",
  "adfalcon.com",
  "adjust.com",
  "admin.appnext.com",
  "admixer.co.kr",
  "admobgeek.com",
  "Adobe",
  "adroll.com",
  "adrta.com",
  "Ads Moloco",
  "Ads Server",
  "Ads Symptotic",
  "AdSafeProtected",
  "agkn.com",
  "airpush.com",
  "akamaihd.net",
  "algovid.com",
  "Altitude-arena",
  "altrooz.com",
  "Amazon",
  "api reporting review mobile ads",
  "api.pingstart.com",
  "App Adsp",
  "app.appsflyer.com",
  "apperol.com",
  "applovin.com",
  "appmakertw",
  "appnext.com",
  "appsflyer.com",
  "AppsGeyser",
  "apptrknow.com",
  "appwalls.mobi",
  "apsalar.com",
  "aptrk.com",
  "Avocarrot",
  "Baidu",
  "beacon.krxd.net",
  "beaconsinspace.com",
  "bidswitch.net",
  "Bluekai.com",
  "bttrack.com",
  "casalemedia.com",
  "cauly.co",
  "chartbeat.net",
  "choices.truste.com",
  "clinkadtracking.com",
  "control.kochava.com",
  "cootek.com",
  "criteo.com",
  "cs.gssprt.jp",
  "cs.nend.net",
  "DoubleVerify",
  "dpm.demdex.net",
  "Dribbble",
  "everesttech.net",
  "Facebook",
  "feedmob.com",
  "Google Ads",
  "Google Analytics",
  "Google Data API",
  "Google Doc",
  "Google Firebase",
  "Google Fonts",
  "Google Map",
  "Google Play",
  "Google Tag Manager",
  "Google Video",
  "Google Vision",
  "Google Youtube",
  "gstatic.com",
  "guest.wireless.cmu.edu",
  "haloapps.com",
  "Heyzap",
  "http://timmystudios.com/",
  "i-mobile.co.jp",
  "impact.applifier.com",
  "inmobi.com",
  "inmobicdn.net",
  "Instagram",
  "intentiq.com",
  "jennywsplash.com",
  "Kakao",
  "kika-backend.com",
  "kikakeyboard.com",
  "Kiosked",
  "Leadbolt Ads",
  "leadboltapps.net",
  "lenzmx.com",
  "lfstmedia.com",
  "liftoff.io",
  "lkqd.net",
  "ludei.com",
  "Microsoft",
  "mixpanel.com",
  "Moat Ads",
  "mobile-up-date.com",
  "mobile.btrll.com",
  "mobilecore.com",
  "Mobincube",
  "mookie1.com",
  "MoPub",
  "mxptint.net",
  "Mydas Mobi",
  "Myi Ads",
  "mysearch-online.com",
  "Native Ads",
  "nend.net",
  "newoffer2017.com",
  "nexac.com",
  "online-metrix.net",
  "paperlit.com",
  "Payco",
  "phonegame.so",
  "play.king.com",
  "Pub Ads",
  "pubmatic.com",
  "quantcount.com",
  "Quiztapp",
  "rayjump.com",
  "sappsuma.com",
  "sc.iasds01.com",
  "Scorecard Research",
  "searchmobileonline.com",
  "Securepub Ads",
  "silvermob.com",
  "simpli.fi",
  "sm-trk.com",
  "smaato",
  "smartadserver",
  "Spotify",
  "Start App Service",
  "stat.appioapp.com",
  "Sticky ads TV",
  "sumatoad.com",
  "SuperSonic Ads",
  "Sync",
  "tapad.com",
  "tapjoy.com",
  "tappx.com",
  "Taptica",
  "Te Ads",
  "theappsgalore.com",
  "tinyhoneybee.com",
  "tlnk.io",
  "turn.com",
  "Twitter",
  "Unity Ads",
  "Unknown",
  "vdopia.com",
  "volo-mobile.com",
  "vungle.com",
  "w55c.net",
  "www.appyet.com",
  "www.blogger.com",
  "www.cdnstabletransit.com",
  "www.cmu.edu",
  "www.gamefeat.net",
  "www.nexogen.in",
  "www.searchmobileonline.com",
  "www.ssacdn.com",
  "www.startappexchange.com",
  "Yahoo",
  "Yandex",
  "ymtracking.com",
  "yyapi.net"
];
const PURPOSES = [
  "Advertisements",
  "Analysis",
  "Authentication",
  "Authorization",
  "Communicating with malware",
  "Connection",
  "Maintenance",
  "Management",
  "Marketing",
  "Remote",
  "Statistical",
  "Storage",
  "Tracking"
];

const SYNTHETIC = [
  // use
  ["access", "apply", "connect", "employ", "process", "save", "use", "utilize"],

  // collect
  ["collect", "gather", "obtain"],

  // store
  ["record", "retain", "store"],

  // share
  [
    "disclose",
    "distribute",
    "exchange",
    "give",
    "lease",
    "provide",
    "release",
    "report",
    "sell",
    "send",
    "share",
    "transfer",
    "transmit"
  ],

  // data item
  // connection
  [
    "Bluetooth",
    "Companion devices",
    "Connectivity status",
    "DNS",
    "Inet",
    "IP",
    "Link",
    "Socket",
    "MAC",
    "Mailto",
    "Network type",
    "Proxy",
    "Route",
    "SSL",
    "URI",
    "VPN",
    "HTTP",
    "NSD",
    "RTP",
    "SIP",
    "Wifi",
    "NFC",
    "URL",
    "Cookie",
    "Authenticator",
    "IDN",
    "Cache"
  ],

  // hardware
  [
    "Camera",
    "Flash",
    "Buffer",
    "Accelerometer sensor",
    "Temperature sensor",
    "Other sensors",
    "Gyroscope sensor",
    "Heart beat sensor",
    "Heart rate sensor",
    "Light sensor",
    "Acceleration sensor",
    "Location sensor",
    "Biometric",
    "Device model",
    "Lens",
    "Screen",
    "Display",
    "Fingerprint",
    "Hardware type",
    "Keyboard",
    "USB",
    "IMEI"
  ],

  // Health&Fitness
  [
    "Bluetooth device",
    "Google Fit",
    "Fitness activity",
    "Time",
    "Glucose",
    "Blood pressure",
    "Body position",
    "Body tempurature",
    "Cervical",
    "Meal",
    "Menstrual flow",
    "Ovulation",
    "Oxygen",
    "Sleep"
  ],

  // location
  [
    "Latitude",
    "Longitude",
    "Address",
    "Country",
    "City",
    "Local name",
    "Locale",
    "Postal code",
    "Criteria",
    "Geographic",
    "Local time",
    "Measurement",
    "Navigation",
    "GPS",
    "Longitude",
    "Latitude",
    "Destination",
    "Location type",
    "Distance",
    "Accuracy",
    "Speed",
    "Altitude",
    "Bearing",
    "NMEA",
    "Locale name",
    "Position",
    "Location activity",
    "Vehicle",
    "Duration",
    "Maps",
    "Places",
    "Location name",
    "Phone number"
  ],

  // media
  [
    "Audio",
    "Image",
    "Player",
    "Video",
    "Recorder",
    "Scanner",
    "Microphone",
    "Remote",
    "Movie",
    "Music",
    "Channels",
    "Volume",
    "Device info",
    "Audio manager",
    "HDMI",
    "Sound",
    "Playback",
    "Headphone",
    "Presentation",
    "Media type",
    "Timestamp",
    "Audio track",
    "Video quality",
    "Camera",
    "Interface",
    "Length",
    "Face detector",
    "Media Cas",
    "Session",
    "Codec",
    "Callback",
    "Color",
    "Feature",
    "Profile",
    "Encoder",
    "Controller",
    "Media description",
    "Media ID",
    "Media name",
    "DRM",
    "Key",
    "Media format",
    "Metadata",
    "Muxer",
    "Players",
    "Voice",
    "Router",
    "Display",
    "Media connection",
    "Sync",
    "Rating",
    "Ringtone",
    "TONE",
    "Processing",
    "Environtmental",
    "Equalizer",
    "Virtualizer",
    "Browser",
    "Effect",
    "Midi",
    "Projection",
    "TV",
    "Preview",
    "Program",
    "Flash",
    "GPS",
    "Speed",
    "Lens",
    "Light",
    "Adapter",
    "HTTP",
    "Sensor",
    "Widget"
  ],

  // Telephony
  [
    "MMS",
    "SMS",
    "ThreadsColumns",
    "Carrier",
    "Service",
    "Network type",
    "MNC",
    "Roaming",
    "Cell",
    "ICC",
    "Session",
    "Phone number",
    "Phone status",
    "Subscription",
    "Telephony manager",
    "Callback",
    "UICC",
    "Voicemail",
    "APN",
    "EUICC",
    "Download",
    "File info",
    "Group call",
    "MBMS"
  ],

  // User info
  [
    "Account",
    "Name",
    "Contact",
    "User profile",
    "Address",
    "Age",
    "Bigraphy",
    "Birthdays",
    "Email",
    "Gender",
    "Organizations",
    "Bigraphic",
    "Nickname",
    "Occupation",
    "Phone number",
    "SIP",
    "URL",
    "profile"
  ],

  // purchase
  ["business", "commercial", "businesses", "purchase"],

  // medical
  ["medical", "healthcare", "health care", "disease"],

  // profiling
  ["profile", "profiling"],

  //
  ["Analytics", "analysis", "analyze", "analyse", "analyzing"],

  //
  ["Statistical", "statistics"],

  //
  ["ads", "advertising", "advertisement", "advertisers"],

  //
  ["maintain", "maintenance", "maintained"],

  //
  [
    "identifier",
    "identifying",
    "authentication",
    "authenticate",
    "authenticates",
    "identity",
    "identities",
    "identifiable",
    "identifies"
  ],

  //
  ["Troubleshooting", "tests", "testing", "troubleshoot"],

  //
  ["purchase", "purchasing", "payment"],

  //
  ["delivery", "shipping", "delivering"],

  //
  ["Contacting", "contacts", "contacted", "communications"],

  //
  ["research", "researching"],

  //
  ["survey"],

  //
  ["Treatment"],

  //
  ["diagnostics", "diagnosis"],

  //
  ["improve", "improving", "improvement"],

  //
  ["new service", "new product", "new feature", "new functions"],

  //
  ["Booking"],

  // third party
  [
    "a.applovin.com",
    "aarki.net",
    "active.mobi",
    "adactioninteractive.com",
    "Adcolony",
    "addthis.com",
    "adfalcon.com",
    "adjust.com",
    "admin.appnext.com",
    "admixer.co.kr",
    "admobgeek.com",
    "Adobe",
    "adroll.com",
    "adrta.com",
    "Ads Moloco",
    "Ads Server",
    "Ads Symptotic",
    "AdSafeProtected",
    "agkn.com",
    "airpush.com",
    "akamaihd.net",
    "algovid.com",
    "Altitude-arena",
    "altrooz.com",
    "Amazon",
    "api reporting review mobile ads",
    "api.pingstart.com",
    "App Adsp",
    "app.appsflyer.com",
    "apperol.com",
    "applovin.com",
    "appmakertw",
    "appnext.com",
    "appsflyer.com",
    "AppsGeyser",
    "apptrknow.com",
    "appwalls.mobi",
    "apsalar.com",
    "aptrk.com",
    "Avocarrot",
    "Baidu",
    "beacon.krxd.net",
    "beaconsinspace.com",
    "bidswitch.net",
    "Bluekai.com",
    "bttrack.com",
    "casalemedia.com",
    "cauly.co",
    "chartbeat.net",
    "choices.truste.com",
    "clinkadtracking.com",
    "control.kochava.com",
    "cootek.com",
    "criteo.com",
    "cs.gssprt.jp",
    "cs.nend.net",
    "DoubleVerify",
    "dpm.demdex.net",
    "Dribbble",
    "everesttech.net",
    "Facebook",
    "feedmob.com",
    "Google Ads",
    "Google Analytics",
    "Google Data API",
    "Google Doc",
    "Google Firebase",
    "Google Fonts",
    "Google Map",
    "Google Play",
    "Google Tag Manager",
    "Google Video",
    "Google Vision",
    "Google Youtube",
    "gstatic.com",
    "guest.wireless.cmu.edu",
    "haloapps.com",
    "Heyzap",
    "http://timmystudios.com/",
    "i-mobile.co.jp",
    "impact.applifier.com",
    "inmobi.com",
    "inmobicdn.net",
    "Instagram",
    "intentiq.com",
    "jennywsplash.com",
    "Kakao",
    "kikabackend.com",
    "kikakeyboard.com",
    "Kiosked",
    "Leadbolt Ads",
    "leadboltapps.net",
    "lenzmx.com",
    "lfstmedia.com",
    "liftoff.io",
    "lkqd.net",
    "ludei.com",
    "Microsoft",
    "mixpanel.com",
    "Moat Ads",
    "mobile-update.com",
    "mobile.btrll.com",
    "mobilecore.com",
    "Mobincube",
    "mookie1.com",
    "MoPub",
    "mxptint.net",
    "Mydas Mobi",
    "Myi Ads",
    "mysearch-online.com",
    "Native Ads",
    "nend.net",
    "newoffer2017.com",
    "nexac.com",
    "online-metrix.net",
    "paperlit.com",
    "Payco",
    "phonegame.so",
    "play.king.com",
    "Pub Ads",
    "pubmatic.com",
    "quantcount.com",
    "Quiztapp",
    "rayjump.com",
    "sappsuma.com",
    "sc.iasds01.com",
    "Scorecard Research",
    "searchmobileonline.com",
    "Securepub Ads",
    "silvermob.com",
    "simpli.fi",
    "smtrk.com",
    "smaato",
    "smartadserver",
    "Spotify",
    "Start App Service",
    "stat.appioapp.com",
    "Sticky ads TV",
    "sumatoad.com",
    "SuperSonic Ads",
    "Sync",
    "tapad.com",
    "tapjoy.com",
    "tappx.com",
    "Taptica",
    "Te Ads",
    "theappsgalore.com",
    "tinyhoneybee.com",
    "tlnk.io",
    "turn.com",
    "Twitter",
    "Unity Ads",
    "Unknown",
    "vdopia.com",
    "volo-mobile.com",
    "vungle.com",
    "w55c.net",
    "www.appyet.com",
    "www.blogger.com",
    "www.cdnstabletransit.com",
    "www.cmu.edu",
    "www.gamefeat.net",
    "www.nexogen.in",
    "www.searchmobileonline.com",
    "www.ssacdn.com",
    "www.startappexchange.com",
    "Yahoo",
    "Yandex",
    "ymtracking.com",
    "yyapi.net"
  ]
];
async function getSentenceStructure(comment) {
  const selectedKeys = ["dobj", "compound", "case", "obl", "amod", "nsubj", "nmod"];
  const result = [];
  const props = new Properties({
    annotators: "tokenize,ssplit,pos,lemma,ner,parse",
    outputFormat: "json",
    timeout: 30000
  });
  const pipeline = new Pipeline(props, "English"); // uses ConnectorServer by default
  const sent = new CoreNLP.simple.Expression(comment);

  const nlpResult = await pipeline.annotate(sent);

  nlpResult.toJSON().sentences.forEach(sentence => {
    const basicDependencies = sentence.toJSON()[3].toJSON();

    Object.entries(basicDependencies).forEach(([, dependent]) => {
      // {
      // 	dep: 'dobj',
      // 	governor: 31,
      // 	governorGloss: 'see',
      // 	dependent: 33,
      // 	dependentGloss: 'room'
      // }
      if (dependent.dep && selectedKeys.includes(dependent.dep)) {
        result.push(dependent);
      }
    });
  });

  return result;
}
function getStructureBySimiWords(securityKeyWords, structure) {
  // get most similar words
  let securitySimiWords = {};

  for (let i = 0; i < securityKeyWords.length; i++) {
    const keyword = securityKeyWords[i];

    let mostSimilarWords;
    if (w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword];
    else {
      mostSimilarWords = w2vModel.mostSimilar(keyword, 20);

      w2vModelData[keyword] = mostSimilarWords;
    }
    securitySimiWords[keyword] = mostSimilarWords;
  }
  const words = Object.entries(securitySimiWords).reduce((acc, [, wordsByKey]) => {
    acc = [...acc, ..._.map(wordsByKey, "word").map(item => item.toLowerCase())];
    return acc;
  }, []);

  const simiWordsSelected = [];
  const result = structure.filter(item => {
    const isBoolean = words.includes(item.governorGloss) || words.includes(item.dependentGloss);

    words.forEach(item2 => {
      if (item2.toLowerCase() === item.governorGloss.toLowerCase())
        simiWordsSelected.push(item.governorGloss);
      if (item2.toLowerCase() === item.dependentGloss.toLowerCase())
        simiWordsSelected.push(item.dependentGloss);
    });

    return isBoolean;
  });

  return [securitySimiWords, result, simiWordsSelected];
}

function getStructureByTypes(types, structure) {
  // get most similar words
  let securitySimiWords = {};

  for (let typeName of types) {
    const subItems = types[typeName];
  }

  for (let i = 0; i < securityKeyWords.length; i++) {
    const keyword = securityKeyWords[i];

    const mostSimilarWords = w2vModel.mostSimilar(keyword, 20);
    securitySimiWords[keyword] = mostSimilarWords;
  }
  console.log(3, securitySimiWords);

  const words = Object.entries(securitySimiWords).reduce((acc, [, wordsByKey]) => {
    acc = [...acc, ..._.map(wordsByKey, "word").map(item => item.toLowerCase())];
    return acc;
  }, []);

  const result = structure.filter(item => {
    return words.includes(item.governorGloss) || words.includes(item.dependentGloss);
  });

  return [securitySimiWords, result];
}

// getStructureComment(comment)
async function getStructureComment(comment) {
  console.log("getSentenceStructure");
  const structure = await getSentenceStructure(comment);

  return structure;
}

async function getStructureBySimis(structure) {
  const securityKeyWords = ["security"];
  let [securitySimiWords, securityStructure] = getStructureBySimiWords(securityKeyWords, structure);
  let [, securityStructureWithKeywords] = getStructureBySimiWords(
    ["bad", "good"],
    securityStructure
  );

  const privacyKeyWords = ["privacy"];
  const [privacySimiWords, privacyStructure] = getStructureBySimiWords(privacyKeyWords, structure);
  let [, privacyStructureWithKeyWords] = getStructureBySimiWords(["bad", "good"], privacyStructure);

  const permissionKeyWords = ["permission"];
  const [permissionSimiWords, permissionStructure] = getStructureBySimiWords(
    permissionKeyWords,
    structure
  );
  let [, permissionStructureWithKeyWords] = getStructureBySimiWords(
    ["bad", "good"],
    permissionStructure
  );

  const collectionKeyWords = ["collection"];
  const [collectionSimiWords, collectionStructure] = getStructureBySimiWords(
    collectionKeyWords,
    structure
  );
  const collectionDataTypes = {};

  for (let typeName in dataTypes) {
    const subItems = dataTypes[typeName];

    subItems.forEach(item => {
      let [
        simiWordsByItem,
        collectionStructureWithKeyWords,
        simiWordsSelected
      ] = getStructureBySimiWords([item], collectionStructure);
      collectionSimiWords[item] = simiWordsByItem;

      if (collectionStructureWithKeyWords && collectionStructureWithKeyWords.length) {
        if (!collectionDataTypes[typeName]) collectionDataTypes[typeName] = [];

        simiWordsSelected.forEach(item => collectionDataTypes[typeName].push(item));

        collectionDataTypes[typeName] = _.uniq(collectionDataTypes[typeName]);
      }
    });
  }

  const sharingKeyWords = ["sharing"];
  const [sharingSimiWords, sharingStructure] = getStructureBySimiWords(sharingKeyWords, structure);
  const sharingDataTypes = {};
  for (let typeName in dataTypes) {
    const subItems = dataTypes[typeName];

    subItems.forEach(item => {
      let [
        simiWordsByItem,
        sharingStructureWithKeyWords,
        simiWordsSelected
      ] = getStructureBySimiWords([item], sharingStructure);
      sharingSimiWords[item] = simiWordsByItem;

      if (sharingStructureWithKeyWords && sharingStructureWithKeyWords.length) {
        if (!sharingDataTypes[typeName]) sharingDataTypes[typeName] = [];

        simiWordsSelected.forEach(item => sharingDataTypes[typeName].push(item));

        sharingDataTypes[typeName] = _.uniq(sharingDataTypes[typeName]);
      }
    });
  }
  return [
    securityKeyWords,
    securitySimiWords,
    securityStructure,
    securityStructureWithKeywords,
    privacyKeyWords,
    privacySimiWords,
    privacyStructure,
    privacyStructureWithKeyWords,
    permissionKeyWords,
    permissionSimiWords,
    permissionStructure,
    permissionStructureWithKeyWords,
    collectionKeyWords,
    collectionSimiWords,
    collectionStructure,
    collectionDataTypes,
    sharingKeyWords,
    sharingSimiWords,
    sharingStructure,
    sharingDataTypes
  ];
}

async function step1() {
  const comments = await Models.Comment.find({
    isGetStructure: { $ne: true }
  });

  for (let i = 0; i < comments.length; i++) {
    console.log(`Running ${i + 1}/${comments.length}`);
    const comment = comments[i];

    // const [securityKeyWords, securitySimiWords, securityStructure, structure] = await getStructureComment(comment.comment)
    const structure = await retry(getStructureComment(comment.comment), 10);

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      {
        isGetStructure: true
      }
    );

    await Models.CommentMeta.insertMany([
      // {
      // 	commentId: comment.id,
      // 	key: 'securityKeyWords',
      // 	value: JSON.stringify(securityKeyWords)
      // },
      // {
      // 	commentId: comment.id,
      // 	key: 'securitySimiWords',
      // 	value: JSON.stringify(securitySimiWords)
      // },
      // {
      // 	commentId: comment.id,
      // 	key: 'securityStructure',
      // 	value: JSON.stringify(securityStructure)
      // },
      {
        commentId: comment.id,
        key: "structure",
        value: JSON.stringify(structure)
      }
    ]);
  }
}

async function step2() {
  console.log("Load model");
  // https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
  w2vModel = await new Promise((resolve, reject) => {
    w2v.loadModel(process.env.W2V_MODEL, function(error, model) {
      if (error) reject(error);

      resolve(model);
    });
  });

  const comments = await Models.Comment.find({
    isAnalyzed: {
      $ne: true
    },
    isLabeled: true
  });

  const step2ByApp = async comment => {
    let structure = await Models.CommentMeta.findOne({
      commentId: comment.id,
      key: "structure"
    });
    structure = JSON.parse(structure.value);

    const [
      securityKeyWords,
      securitySimiWords,
      securityStructure,
      securityStructureWithKeywords,
      privacyKeyWords,
      privacySimiWords,
      privacyStructure,
      privacyStructureWithKeyWords,
      permissionKeyWords,
      permissionSimiWords,
      permissionStructure,
      permissionStructureWithKeyWords,
      collectionKeyWords,
      collectionSimiWords,
      collectionStructure,
      collectionDataTypes,
      sharingKeyWords,
      sharingSimiWords,
      sharingStructure,
      sharingDataTypes
    ] = await getStructureBySimis(structure);

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      {
        securityKeyWords,
        securitySimiWords,
        securityStructure,
        securityStructureWithKeywords,
        privacyKeyWords,
        privacySimiWords,
        privacyStructure,
        privacyStructureWithKeyWords,
        permissionKeyWords,
        permissionSimiWords,
        permissionStructure,
        permissionStructureWithKeyWords,
        collectionKeyWords,
        collectionSimiWords,
        collectionStructure,
        collectionDataTypes,
        sharingKeyWords,
        sharingSimiWords,
        sharingStructure,
        sharingDataTypes,
        isAnalyzed: true
      }
    );

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "securityKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "securitySimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "securityStructure" });
    await Models.CommentMeta.deleteMany({
      commentId: comment.id,
      key: "securityStructureWithKeywords"
    });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "privacyKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "privacySimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "privacyStructure" });
    await Models.CommentMeta.deleteMany({
      commentId: comment.id,
      key: "privacyStructureWithKeyWords"
    });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "permissionKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "permissionSimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "permissionStructure" });
    await Models.CommentMeta.deleteMany({
      commentId: comment.id,
      key: "permissionStructureWithKeyWords"
    });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionSimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionStructure" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "collectionDataTypes" });

    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingKeyWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingSimiWords" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingStructure" });
    await Models.CommentMeta.deleteMany({ commentId: comment.id, key: "sharingDataTypes" });

    await Models.CommentMeta.insertMany([
      {
        commentId: comment.id,
        key: "securityKeyWords",
        value: JSON.stringify(securityKeyWords)
      },
      {
        commentId: comment.id,
        key: "securitySimiWords",
        value: JSON.stringify(securitySimiWords)
      },
      {
        commentId: comment.id,
        key: "securityStructure",
        value: JSON.stringify(securityStructure)
      },
      {
        commentId: comment.id,
        key: "securityStructureWithKeywords",
        value: JSON.stringify(securityStructureWithKeywords)
      },

      {
        commentId: comment.id,
        key: "privacyKeyWords",
        value: JSON.stringify(privacyKeyWords)
      },
      {
        commentId: comment.id,
        key: "privacySimiWords",
        value: JSON.stringify(privacySimiWords)
      },
      {
        commentId: comment.id,
        key: "privacyStructure",
        value: JSON.stringify(privacyStructure)
      },
      {
        commentId: comment.id,
        key: "privacyStructureWithKeyWords",
        value: JSON.stringify(privacyStructureWithKeyWords)
      },

      {
        commentId: comment.id,
        key: "permissionKeyWords",
        value: JSON.stringify(permissionKeyWords)
      },
      {
        commentId: comment.id,
        key: "permissionSimiWords",
        value: JSON.stringify(permissionSimiWords)
      },
      {
        commentId: comment.id,
        key: "permissionStructure",
        value: JSON.stringify(permissionStructure)
      },
      {
        commentId: comment.id,
        key: "permissionStructureWithKeyWords",
        value: JSON.stringify(permissionStructureWithKeyWords)
      },

      {
        commentId: comment.id,
        key: "collectionKeyWords",
        value: JSON.stringify(collectionKeyWords)
      },
      {
        commentId: comment.id,
        key: "collectionSimiWords",
        value: JSON.stringify(collectionSimiWords)
      },
      {
        commentId: comment.id,
        key: "collectionStructure",
        value: JSON.stringify(collectionStructure)
      },
      {
        commentId: comment.id,
        key: "collectionDataTypes",
        value: JSON.stringify(collectionDataTypes)
      },

      {
        commentId: comment.id,
        key: "sharingKeyWords",
        value: JSON.stringify(sharingKeyWords)
      },
      {
        commentId: comment.id,
        key: "sharingSimiWords",
        value: JSON.stringify(sharingSimiWords)
      },
      {
        commentId: comment.id,
        key: "sharingStructure",
        value: JSON.stringify(sharingStructure)
      },
      {
        commentId: comment.id,
        key: "sharingDataTypes",
        value: JSON.stringify(sharingDataTypes)
      }
    ]);
  };

  const commentChunks = _.chunk(comments, 100);
  for (let i = 0; i < commentChunks.length; i++) {
    console.log(`Running ${i + 1}/${commentChunks.length}`);
    const chunk = commentChunks[i];

    await Promise.all(chunk.map(step2ByApp));
  }
}

async function step22() {
  console.log("Load model");
  // https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit?resourcekey=0-wjGZdNAUop6WykTtMip30g
  w2vModel = await new Promise((resolve, reject) => {
    w2v.loadModel(process.env.W2V_MODEL, function(error, model) {
      if (error) reject(error);

      resolve(model);
    });
  });

  const getMostSimilarWords = keyword => {
    let mostSimilarWords = [];
    if (w2vModelData[keyword]) mostSimilarWords = w2vModelData[keyword];
    else {
      mostSimilarWords = w2vModel.mostSimilar(keyword, 20) || [];
      w2vModelData[keyword] = mostSimilarWords;
    }

    mostSimilarWords = _.map(mostSimilarWords, "word").map(item => item.toLowerCase());

    return mostSimilarWords && mostSimilarWords.length ? mostSimilarWords : [keyword.toLowerCase()];
  };

  const findKeydsInText = (keys, text) => {
    text = text.toLowerCase();

    return keys.filter(key => text.includes(key.toLowerCase()));
  };

  const getData = async comment => {
    const commentText = comment.comment;
    const subComments = commentText
      .split(".")
      .map(item => item.trim())
      .filter(item => !!item);

    //
    const simiSecurity = getMostSimilarWords("security");
    let securitySentences = subComments.filter(subComment => {
      return simiSecurity.some(word => subComment.toLowerCase().includes(word.toLowerCase()));
    });
    securitySentences = _.uniq(securitySentences);

    //
    const simiPrivacy = getMostSimilarWords("privacy");
    let privacySentences = subComments.filter(subComment => {
      return simiPrivacy.some(word => subComment.toLowerCase().includes(word.toLowerCase()));
    });
    privacySentences = _.uniq(privacySentences);

    //
    const simiPermission = getMostSimilarWords("permission");
    const hasPermission = simiPermission.some(word =>
      commentText.toLowerCase().includes(word.toLowerCase())
    );
    let permissionSentences = [];
    if (hasPermission) {
      const simiPermissionItems = PERMISSIONS.reduce((acc, item) => {
        return (acc = [...acc, ...getMostSimilarWords(item)]);
      }, []);
      permissionSentences = subComments.filter(subComment => {
        return !!findKeydsInText(simiPermissionItems, subComment).length;
      });
    }

    //

    const dataItems = DATA_TYPES.filter(item => {
      // const simiItems = getMostSimilarWords(item);

      // return !!findKeydsInText(simiItems, commentText).length;
      return commentText.toLowerCase().includes(item.toLowerCase());
    });

    //
    const purposes = PURPOSES.filter(item => {
      // const simiItems = getMostSimilarWords(item);

      // return !!findKeydsInText(simiItems, commentText).length;
      return commentText.toLowerCase().includes(item.toLowerCase());
    });

    //
    const thirdParties = THIRD_PARTIES.filter(item => {
      // const simiItems = getMostSimilarWords(item);

      // return !!findKeydsInText(simiItems, commentText).length;
      return commentText.toLowerCase().includes(item.toLowerCase());
    });
    //
    const simiCollection = getMostSimilarWords("collection");
    const hasCollection = !!findKeydsInText(simiCollection, commentText).length;

    let collectionSentences = [];
    if (hasCollection) {
      const simiItems = [...DATA_TYPES, ...PURPOSES].reduce((acc, item) => {
        return (acc = [...acc, ...getMostSimilarWords(item)]);
      }, []);

      collectionSentences = subComments.filter(subComment => {
        return !!findKeydsInText(simiItems, subComment).length;
      });
    }
    collectionSentences = _.uniq(collectionSentences);

    //
    const simiSharing = getMostSimilarWords("sharing");
    const hasSharing = !!findKeydsInText(simiSharing, commentText).length;
    let sharingSentences = [];
    if (hasSharing) {
      const simiItems = [...DATA_TYPES, ...PURPOSES, ...THIRD_PARTIES].reduce((acc, item) => {
        return (acc = [...acc, ...getMostSimilarWords(item)]);
      }, []);

      sharingSentences = subComments.filter(subComment => {
        return !!findKeydsInText(simiItems, subComment).length;
      });
    }
    sharingSentences = _.uniq(sharingSentences);

    const result = {
      securitySentences,
      privacySentences,
      permissionSentences,
      collectionSentences,
      sharingSentences,
      dataItems,
      purposes,
      thirdParties
    };

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      result
    );
    return;
  };

  const comments = await Models.Comment.find({
    // isLabeled: true
  });

  // for(let i = 0; i < comments.length; i++) {
  // 	const comment = comments[i]

  // 	await getData(comment.comment)
  // }

  await bluebird.map(
    comments,
    (comment, i) => {
      console.log(`Running ${i + 1}/${comments.length}`);
      return getData(comment);
    },
    { concurrency: 50 }
  );
  // const commentChunks = _.chunk(comments, 100);
  // for (let i = 0; i < commentChunks.length; i++) {
  //   console.log(`Running ${i + 1}/${commentChunks.length}`);
  //   const chunk = commentChunks[i];

  //   await Promise.all(chunk.map(getData));
  // }

  console.log("DONE");
}

async function reportComments() {
  const [comments, answers] = await Promise.all([Models.Comment.find({}), Models.Answer.find()]);

  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "comments",
      title: "Comments"
    },
    {
      id: "app",
      title: "App"
    },
    {
      id: "security",
      title: "Security"
    },
    {
      id: "privacy",
      title: "Privacy"
    },
    {
      id: "permission",
      title: "Permission"
    },
    {
      id: "dataCollection",
      title: "Data collection"
    },
    {
      id: "dataSharing",
      title: "Data sharing"
    }
  ];
  let rows = [];

  await bluebird.map(
    comments,
    (comment, i) => {
      return (async () => {
        let row = {};
        // const app = await Models.App.findOne({
        //   appName: comment.appName
        // });
        answers.forEach(answer => {
          const { questions: answerQuestions } = answer;
          answerQuestions.forEach(answerQuestion => {
            if (answerQuestion.commentId === comment.commentId) {
              const responses = answerQuestion.responses;

              const security = responses.find(item => item.name === "question2");
              const privacy = responses.find(item => item.name === "question3");
              const permission = responses.find(item => item.name === "question4");
              const dataCollection = responses.find(item => item.name === "question5");
              const dataSharing = responses.find(item => item.name === "question6");

              row = {
                ...row,
                security: security.value !== "3" ? "x" : "",
                privacy: privacy.value !== "3" ? "x" : "",
                permission: dataCollection.value === "1" ? "x" : "",
                dataCollection: dataCollection.value === "1" ? "x" : "",
                dataSharing: dataCollection.value === "1" ? "x" : ""
              };
            }
          });
        });

        rows.push({
          ...row,
          stt: i + 1,
          app: comment.appName,
          comments: comment.comment
        });
      })();
    },
    { concurrency: 100 }
  );
  rows = _.sortBy(rows, "stt");
  const csvWriter = createCsvWriter({
    path: "./comments-report.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
}

async function getTranningSet() {
  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/Label_Comments.csv");

  const header = [
    // {
    //   id: "stt",
    //   title: "#"
    // },
    {
      id: "label",
      title: "label"
    },
    // {
    //   id: "char",
    //   title: "char"
    // },
    {
      id: "comment",
      title: "comment"
    }
  ];

  const securityTraning = [];
  for (let i = 0; i < dataCSV.length; i++) {
    const [stt, comment, appName, rating, security] = dataCSV[i];

    const generatedComments = generateComment(comment);
    generatedComments.forEach(commentText => {
      securityTraning.push({
        stt,
        label: security === "" ? 1 : 2,
        char: "q",
        comment: commentText
      });
    });
  }

  const csvWriter = createCsvWriter({
    path: "./securityTraning.csv",
    header
  });
  csvWriter.writeRecords(securityTraning);
  console.log("done");
}

async function getTestingSet() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "comment",
      title: "comment"
    }
  ];
  const comments = await Models.Comment.find({});

  const rows = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    rows.push({
      stt: i,
      comment: comment.comment
    });
  }

  const csvWriter = createCsvWriter({
    path: "./testing.csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("done");
}

function generateComment(comment) {
  if (!comment) return [];
  comment = comment.toLowerCase();

  let result = [comment];
  SYNTHETIC.forEach(words => {
    words = words.map(word => word.toLowerCase());

    words.forEach(word => {
      const foundWord = !!word && !!comment.includes(word) && word;

      if (foundWord) {
        const regex = new RegExp(`(${foundWord}[a-z]*)`, "gi");

        words.forEach(item => {
          const newComment = comment.replace(regex, item);

          result.push(newComment);
        });
      }
    });
  });

  result = _.uniq(result);

  return result;
}

async function rawData() {
  const fs = require("fs");
  console.log("1");
  // const res = await axios.get("https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=kaka1");
  const $ = cheerio.load(res.data);
  fs.writeFileSync("./kaka.html", res.data);
  console.log("loaded");
  $("#gs_res_ccl_mid .gs_r.gs_or.gs_scl").each((index, post) => {
    console.log(index);
    const $post = $(post);
    const title = $post.find("h3 a").text();
    let relatedPostAction = $post
      .find(".gs_ri .gs_fl a")
      .filter((_, action) => $(action).text() === "Related articles");
    relatedPostAction = relatedPostAction[0];
    const relatedPostActionHTML = $(relatedPostAction).html();

    if (relatedPostActionHTML) {
      const regex = new RegExp("q=info:([a-zA-Z0-9]+):scholar.google.com", "i");
      // const id = "https://scholar.google.com/scholar?q=info:Eu2XDpXt6G4J:scholar.google.com/&output=cite&scirp=0&hl=en".match(regex)[1]
      console.log(id);
    }
    console.log(1, title, relatedPostActionHTML);

    // const res = await axios.get(
    //   "https://scholar.google.com/scholar?q=info:Eu2XDpXt6G4J:scholar.google.com/&output=cite&scirp=0&hl=en"
    // );
  });
  console.log("Done");
}

async function calculateResults() {
  console.log("Running calculateResults");
  const comments = await Models.Comment.find({
    // permissionResult: { $exists: false }
  });

  await bluebird.map(
    comments,
    (comment, i) => {
      return (async () => {
        let {
          id,
          appName,
          permissions: commentPermissions = [],
          dataTypes: commentDataType = {},
          purposes: commentPurposes = [],
          thirdParties: commentThirdParties = [],
          perissionType,
          dataItemType,
          purposeType,
          thirdPartyType
        } = comment;

        const app = await Models.App.findOne({
          appName: appName
        });
        if (!app) return;
        const {
          permissions: appPermissions = [],
          dataTypes: appDataItems = [],
          purposesHP: appPurposes = [],
          thirdPartiesHP: appThirdParties = []
        } = app;

        const appPermissionGroups = getPermissionGroups(appPermissions);
        const permissionResult = calculatePermissionOnlyPer(
          appPermissionGroups,
          commentPermissions,
          perissionType,
          appPermissions
        );

        // data type
        const appDataTypes = getDataTypesFromItem(appDataItems);
        commentDataType = Object.keys(commentDataType);
        const dataTypeResult = calculatePermission(appDataTypes, commentDataType, dataItemType);

        // purpose
        const purposeResult = calculatePermission(appPurposes, commentPurposes, purposeType);

        console.log({ appThirdParties, commentThirdParties });
        // thirt party
        const thirdPartyResult = calculatePermission(
          appThirdParties,
          commentThirdParties,
          thirdPartyType
        );

        await Models.Comment.updateOne(
          {
            _id: id
          },
          {
            permissionResult,
            dataTypeResult,
            purposeResult,
            thirdPartyResult
          }
        );
      })();
    },
    { concurrency: 100 }
  );
}

function getDataTypesFromItem(dataItems) {
  const result = Object.entries(dataCollectionTypes)
    .filter(([dataTypeName, dataItemsInType]) => {
      return !!_.intersection(dataItemsInType, dataItems).length;
    })
    .map(([dataTypeName]) => dataTypeName);

  return result;
}
function calculatePermissionOnlyPer(
  appPermissionGroups,
  commentPermissions,
  perissionType,
  appPermissionItems
) {
  let permissionResult = 0;
  const totalAppPermision = appPermissionGroups.length;
  const totalCommentPermision = commentPermissions.length;
  try {
    if (!totalAppPermision || !totalCommentPermision) {
      return permissionResult;
    }

    if (perissionType === "all") {
      permissionResult = (appPermissionItems / 191).toFixed(2);
    } else if (perissionType === "specific") {
      const intersection = _.intersection(appPermissionGroups, commentPermissions);

      permissionResult = (intersection.length / totalCommentPermision).toFixed(2);
    }

    return permissionResult;
  } catch (err) {
    console.log("calculatePermission ERROR", err.message, totalAppPermision, totalCommentPermision);
  }
}

function calculatePermission(appPermissionGroups, commentPermissions, perissionType) {
  let permissionResult = 0;
  const totalAppPermision = appPermissionGroups.length;
  const totalCommentPermision = commentPermissions.length;
  try {
    if (!totalAppPermision || !totalCommentPermision) {
      return permissionResult;
    }

    if (perissionType === "all") {
      permissionResult = (totalCommentPermision / totalAppPermision).toFixed(2);
    } else if (perissionType === "specific") {
      const intersection = _.intersection(appPermissionGroups, commentPermissions);

      permissionResult = (intersection.length / totalCommentPermision).toFixed(2);
    }

    return permissionResult;
  } catch (err) {
    console.log("calculatePermission ERROR", err.message, totalAppPermision, totalCommentPermision);
  }
}
function getPermissionGroups(appPermissions) {
  if (!appPermissions.length) return [];
  const appPermissionGroups = Object.entries(permissionTypes)
    .filter(([_, permissions]) => {
      return !!getDupkicatedValues([...permissions, ...appPermissions]).length;
    })
    .map(([groupName]) => groupName);
  return appPermissionGroups;
}
function getDupkicatedValues(arr) {
  return _.filter(arr, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
}

async function getSentimentOfApp() {
  const Analyzer = require("natural").SentimentAnalyzer;
  const stemmer = require("natural").PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");

  const comments = await Models.Comment.find({
    // sentiment: { $exists: false }
  });

  console.log("comments", comments);
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];

    const sentiment = analyzer.getSentiment(comment.comment.split(" ")).toFixed(2);

    await Models.Comment.updateOne(
      {
        _id: comment.id
      },
      {
        sentiment
      }
    );
  }
  console.log("DONE getSentimentOfApp");
}
async function updateSectionsToShow() {
  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/Comment_dataset.csv");

  await bluebird.map(
    dataCSV,
    async (item, i) => {
      const [
        stt,
        comment,
        appName,
        security,
        privacy,
        permission,
        dataCollection,
        dataSharing
      ] = item;

      await Models.Comment.updateOne(
        {
          comment
        },
        {
          isShowSecurityRail3: security === "x",
          isShowPrivacyRail3: privacy === "x",
          isShowPermissionRail3: permission === "x",
          isShowDataCollectionRail3: dataCollection === "x",
          isShowDataSharingRail3: dataSharing === "x"
        }
      );
    },
    { concurrency: 100 }
  );
}
async function getDistance() {
  const apps = await Models.App.find({
    // sentiment: { $exists: false }
  }).select("distance");

  const maxDis = _.maxBy(apps, "distance").get("distance");
  const minDis = _.minBy(apps, "distance").get("distance");

  const segment = (maxDis - minDis) / 5;

  const rangeVL = [minDis, minDis + segment * 1];
  const rangeL = [minDis + segment * 1, minDis + segment * 2];
  const rangeN = [minDis + segment * 2, minDis + segment * 3];
  const rangeH = [minDis + segment * 3, minDis + segment * 4];
  const rangeVH = [minDis + segment * 4, minDis + segment * 5];

  for (let i = 0; i < apps.length; i++) {
    console.log(i);
    const app = apps[i];

    let distanceRais3;
    if (_.inRange(app.distance, ...rangeVL)) {
      distanceRais3 = 0.1;
    } else if (_.inRange(app.distance, ...rangeL)) {
      distanceRais3 = 0.3;
    } else if (_.inRange(app.distance, ...rangeN)) {
      distanceRais3 = 0.5;
    } else if (_.inRange(app.distance, ...rangeH)) {
      distanceRais3 = 0.7;
    } else if (_.inRange(app.distance, ...rangeVH)) {
      distanceRais3 = 0.9;
    } else {
      distanceRais3 = 0.5;
    }

    await Models.App.updateOne(
      {
        _id: app.id
      },
      {
        distanceRais3
      }
    );
  }
  console.log("DONE");
}

async function updateComentShow() {
  let comments = await Models.Comment.find({
    // isShowOnRais3: { $exists: false }
  });

  await bluebird.map(
    comments,
    async comment => {
      const app = await Models.App.findOne({
        appName: comment.appName
      });
      if (!app) return;
      comment = comment.toJSON();
      comment.sentiment = Number(
        (1 - Math.abs(app.distance - (1 - Math.abs(comment.sentiment)))).toFixed(2)
      );

      const isShowSecurity = !!comment.sentiment && !!comment.securitySentences.length;
      const isShowPrivacy = !!comment.sentiment && !!comment.privacySentences.length;
      const isShowPermission = !!comment.permissionResult && !!comment.permissions.length;
      const isShowDataItem = !!comment.dataTypeResult && !!comment.dataItems.length;
      const isShowPurpose = !!comment.purposeResult && !!comment.purposes.length;
      const isShowThirdParty = !!comment.thirdPartyResult && !!comment.thirdParties.length;

      const isShowOnRais3 =
        isShowSecurity ||
        isShowPrivacy ||
        isShowPermission ||
        isShowDataItem ||
        isShowPurpose ||
        isShowThirdParty;
      return Models.Comment.updateOne(
        {
          _id: comment.id
        },
        {
          isShowSecurityRais3: isShowSecurity,
          isShowPrivacyRais3: isShowPrivacy,
          isShowPermissionRais3: isShowPermission,
          isShowDataItemRais3: isShowDataItem,
          isShowPurposeRais3: isShowPurpose,
          isShowThirdPartyRais3: isShowThirdParty,
          isShowOnRais3
        }
      );
    },
    { concurrency: 50 }
  );

  console.log("DONE");
}

async function getCommentSurvey() {
  let apps = await Models.App.find({});

  const appsHasComment = await bluebird.filter(apps, async app => {
    const isHasComment = await Models.Comment.findOne({
      appName: app.appName,
      isShowOnRais3: true
    });
    return !!isHasComment;
  });

  const appSurveys = _.chunk(appsHasComment, 7);

  await Models.AppSurvey.deleteMany();

  await bluebird.map(appSurveys, async apps => {
    if (apps.length < 7) return;
    return Models.AppSurvey.create({
      apps: apps.map((app, stt) => ({ stt: stt + 1, appId: app.id }))
    });
  });

  console.log("DONE");
}

async function report2() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "id",
      title: "id"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "time",
      title: "Time"
    },
    {
      id: "app1",
      title: "App 1"
    },
    {
      id: "app2",
      title: "App 2"
    },
    {
      id: "app3",
      title: "App 3"
    },
    {
      id: "app4",
      title: "App 4"
    },
    {
      id: "app5",
      title: "App 5"
    },
    {
      id: "app6",
      title: "App 6"
    },
    {
      id: "app7",
      title: "App 7"
    },
    {
      id: "satisfied",
      title: "Satisfied"
    },
    {
      id: "comment",
      title: "Comment"
    }
  ];

  const getValueByBoolean = value => {
    if (value === 1) return "Yes";
    else if (value === 0) return "No";
    else if (value === 2) return "Partially";
  };

  const getNameBySttSub = stt => {
    if (stt == 0) return "Security";
    else if (stt == 1) return "Privacy";
    else if (stt == 3) return "Permission";
    else if (stt == 5) return "Data sharing";
  };

  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/tuanle/Downloads/CSVReport_9b45f61b802d_B_Page#1_With_PageSize#5000.csv");

  const rows = [];
  const answers = await Models.Answer.find({});

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);

    if (!user.isAnswerd || answer.questions.length < 7) continue;

    const resultInMicro = dataFromMicro.find(
      item => item[9]?.trim().toLowerCase() === user.email.trim().toLowerCase()
    );

    let row = {};
    let time = 0;
    answer.questions.forEach(appRes => {
      let appCol = "";
      appCol = `Time: ${appRes.time}s\n`;
      appRes.responses.forEach((commentRes, commentStt) => {
        appCol += `Comment ${commentStt + 1}: ${getValueByBoolean(commentRes.value)} \n`;

        if (commentRes.value == 2) {
          appCol += "   User provied:\n";
          Object.entries(commentRes.subQuestions).forEach(([sttSub, objectValue]) => {
            if (objectValue.selected) {
              appCol += `   - ${getNameBySttSub(sttSub)}: ${objectValue.result} \n`;
            }
          });
        }
      });

      row[`app${appRes.stt}`] = appCol;

      time += appRes.time;
    });

    rows.push({
      ...row,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      time: resultInMicro ? resultInMicro[8] : "",
      satisfied: answer.isSatisfied ? "Yes" : "No",
      comment: answer.isHasComment ? `Yes - ${answer.comment}` : "No"
    });
  }

  const csvWriter = createCsvWriter({
    path: "./report-rais3(file2).csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
}
async function report1() {
  let result = {
    0: 0,
    1: 0,
    2: 0
  };
  const answers = await Models.Answer.find({});
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];

    const user = await Models.User.findById(answer.userId);
    if (!user.isAnswerd || answer.questions.length < 7) continue;

    answer.questions.forEach(appRes => {
      appRes.responses.forEach(commentRes => {
        result[commentRes.value]++;
      });
    });
  }
  delete result.null;
  const total = _.sum(Object.values(result));

  const getValueByBoolean = value => {
    if (value == 1) return "Yes";
    else if (value == 0) return "No";
    else if (value == 2) return "Partially";
  };

  let text = "";
  Object.entries(result).forEach(([key, value]) => {
    text += `${getValueByBoolean(key)}: ${value}(${(value / total).toFixed(2) * 100}%)}\n`;
  });

  fs.writeFileSync("./report-rais3(file1).txt", text);
  console.log("DONE");
}

async function statAppcomment() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "appName",
      title: "App Name"
    },
    {
      id: "categoryName",
      title: "Category Name"
    },
    {
      id: "totalComment",
      title: "Total Comment"
    },
    {
      id: "totalRelatedComment",
      title: "Comments Including Keyword"
    }
  ];

  const apps = await Models.App.find({
    isGotCommentV2: true
  }).select("appName categoryName");

  let rows = [];

  await Promise.map(
    apps,
    async (app, index) => {
      const comments = await Models.Comment.find({
        appId: app._id
      }).select("isRelatedRail3");

      const relatedComments = comments.filter(item => item.isRelatedRail3);

      rows.push({
        stt: index + 1,
        appName: app.appName,
        categoryName: app.categoryName,
        totalComment: comments.length,
        totalRelatedComment: relatedComments.length
      });
    },
    { concurrency: 1000 }
  );

  rows = rows.filter(row => row.totalRelatedComment !== 0);
  rows = _.orderBy(rows, ["totalRelatedComment"], ["desc"]);
  rows = rows.map((item, index) => {
    item.stt = index + 1;

    return item;
  });

  const csvWriter = createCsvWriter({
    path: "./app-comment(rais3).csv",
    header
  });
  csvWriter.writeRecords(rows);
}

async function statCatApp() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "categoryName",
      title: "Category Name"
    },
    {
      id: "app",
      title: "App"
    }
  ];

  let apps = await Models.App.find({
    isGotCommentV2: true
  }).select("appName categoryName");

  apps = await Promise.map(
    apps,
    async app => {
      const totalComment = await Models.Comment.count({
        appId: app._id,
        isRelatedRail3: true
      }).select("_id");

      return {
        ...app.toJSON(),
        totalComment
      };
    },
    { concurrency: 1000 }
  );

  const appsGroupByCat = _.groupBy(apps, "categoryName");

  let rows = [];
  Object.entries(appsGroupByCat).forEach(([categoryName, apps], index) => {
    rows.push({
      stt: index + 1,
      categoryName,
      app: _.sumBy(apps, "totalComment")
    });
  });

  rows = _.orderBy(rows, ["app"], ["desc"]);
  rows = rows.map((item, index) => {
    item.stt = index + 1;

    return item;
  });

  console.log(rows);

  const csvWriter = createCsvWriter({
    path: "./category-app(rais3).csv",
    header
  });
  csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function getRemainingComments() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "categoryName",
      title: "Category Name"
    },
    {
      id: "appName",
      title: "App Name"
    },
    {
      id: "userName",
      title: "User Name"
    },
    {
      id: "comment",
      title: "comment"
    }
  ];

  const comments = await Models.Comment.find({
    label: { $exists: false }
  });

  let rows = await Promise.map(
    comments,
    async function(comment) {
      const app = await Models.App.findOne({
        appName: comment.appName
      }).cache(60 * 1000);

      return {
        categoryName: app.categoryName,
        appName: app.appName,
        userName: comment.userName,
        comment: comment.comment
      };
    },
    { concurrency: 100 }
  );

  rows = rows.map((item, i) => {
    item.stt = i + 1;

    return item;
  });

  const csvWriter = createCsvWriter({
    path: "./remaining-apps-without-lable(mobile_purpose).csv",
    header
  });
  csvWriter.writeRecords(rows);

  console.log("DONE");
}

async function getPredictionReport() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    // {
    //   id: "categoryName",
    //   title: "Category Name"
    // },
    // {
    //   id: "appName",
    //   title: "App Name"
    // },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "sp",
      title: "S&P"
    },
    {
      id: "permission",
      title: "Permission"
    },
    {
      id: "dataCollection",
      title: "Data collection"
    },
    {
      id: "dataSharing",
      title: "Data sharing"
    }
  ];

  const comments = await Models.Comment.find({
    scores: { $exists: true }
  });

  let rows = await Promise.map(
    comments,
    async function(comment, index) {
      // const app = await Models.App.findOne({
      //   _id: comment.appId
      // }).cache(60 * 1000);

      return {
        comment: comment.comment,
        sp: comment.scores.SPLabel,
        permission: comment.scores.SPLabel,
        dataCollection: comment.scores.SPLabel,
        dataSharing: comment.scores.SPLabel
      };
    },
    { concurrency: 100 }
  );

  rows = rows.map((item, i) => {
    item.stt = i + 1;

    return item;
  });

  const csvWriter = createCsvWriter({
    path: "./comments-prediction.csv",
    header
  });
  csvWriter.writeRecords(rows);

  console.log("DONE");
}

main();
async function main() {
  // await getRemainingComments();
  await Promise.all([statCatApp(), statAppcomment(), getPredictionReport()]);

  // await statAppcomment();
  // await report1();
  // await report2();
  // await getCommentSurvey();
  // await updateComentShow();
  // await getDistance();
  // await step22();
  // await getSentimentOfApp();
  // await calculateResults();
  // await updateSectionsToShow();

  // await generateComments();
  // await getTestingSet();
  // await getTranningSet();

  // await rawData();

  // await reportComments();
  return;
  // await step1()
  // await step2()
  // await step22()

  await Promise.all([
    // reportSurvey2(),
    // explanationReport(),
    // getUserEmail(),
    // getUserDone()
  ]);

  let dataURLFile = fs.readFileSync("./dataURL.json", "utf-8");
  dataURLFile = JSON.parse(dataURLFile);

  let dataCSV = await csv({
    noheader: false,
    output: "csv"
  }).fromFile("./urls.csv");
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "url",
      title: "Url"
    },
    {
      id: "total",
      title: "Total apps"
    },
    {
      id: "malware",
      title: "Malware"
    }
  ];
  const rows = [];
  for (let i = 0; i < dataCSV.length; i++) {
    console.log(`Running ${i + 1}/${dataCSV.length}`);
    const [stt, url, total] = dataCSV[i];

    let maliApp = dataURLFile.find(item => item.url === url);
    if (!maliApp) {
      const requestURl = `https://ipqualityscore.com/api/json/url/pdsizCQXtcP9NK0A4luZsC7YSatUHcgk/${encodeURIComponent(
        url
      )}`;

      try {
        const res = await axios.get(requestURl);
        maliApp = res.data;
      } catch (err) {
        maliApp = {
          malware: null
        };
      }

      maliApp.url = url;
      dataURLFile.push(maliApp);
      fs.writeFileSync("./dataURL.json", JSON.stringify(dataURLFile, null, 2), "utf-8");
    }

    rows.push({
      stt,
      url,
      total,
      malware: maliApp.malware === null ? "Cannot identify" : maliApp.malware ? "Yes" : "No"
    });
  }

  const csvWriter = createCsvWriter({
    path: "./urls(ver2).csv",
    header
  });
  csvWriter.writeRecords(rows);
  console.log("DONE");
  return;
  let appsDB = fs.readFileSync(
    "/Users/a1234/Downloads/Static-DynamicDataOf_1379_TargetApps.json",
    "utf-8"
  );
  appsDB = JSON.parse(appsDB);
  const appIds = appsDB.map(app => app.appIdCHPlay);
  console.log(appIds);
  const selectedApps = [];
  const apps = [];
  const urls = {};
  var readline = require("linebyline"),
    rl = readline("/Users/a1234/Downloads/data_collect_purpose.json");
  rl.on("line", function(line, lineCount, byteCount) {
    // do something with the line of text
    const app = JSON.parse(line);
    if (app && app.data && appIds.includes(app.app)) apps.push(app.app);

    if (app && app.data && app.data.url && appIds.includes(app.app)) {
      let url = app.data.url.split("|")[0].trim();
      if (url && url !== "tracking" && url !== "null") {
        if (!urls[url]) urls[url] = [];

        urls[url].push(app.app);
        selectedApps.push(app.app);
      }
    }
  })
    .on("error", function(e) {
      // something went wrong
    })
    .on("close", function(e) {
      console.log(_.uniq(apps));
      console.log(1, _.uniq(selectedApps).length, _.uniq(apps).length);
      const header = [
        {
          id: "stt",
          title: "#"
        },
        {
          id: "url",
          title: "Url"
        },
        {
          id: "total",
          title: "Total apps"
        }
      ];
      let rows = [];
      //   decodeURI
      //   axios.get('/user?ID=12345')
      const arrayUrls = Object.entries(urls);
      for (let i = 0; i < arrayUrls.length; i++) {
        const [url, apps] = arrayUrls[i];

        // let maliApp = dataURLFile.find(item => item.url === url)

        // if(!maliApp) {
        // 	const maliApp = await axios.get(`https://ipqualityscore.com/api/json/url/pdsizCQXtcP9NK0A4luZsC7YSatUHcgk/${decodeURI(url)}`)
        // 	console.log(1, maliApp)
        // 	maliApp.url = url

        // 	dataURLFile.push(maliApp)
        // 	fs.writeFileSync("./dataURL.json", JSON.stringify(dataURLFile),"utf-8")
        // }
        rows.push({
          stt: i + 1,
          url,
          total: _.uniq(apps).length
        });
      }

      rows = _.orderBy(rows, ["total"], ["desc"]);
      rows = rows.map((item, index) => {
        item.stt = index + 1;
        return item;
      });
      const csvWriter = createCsvWriter({
        path: "./urls.csv",
        header
      });
      csvWriter.writeRecords(rows);

      console.log("DONE");
    });
}
async function getUserDone() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "id",
      title: "ID of microworker"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "time",
      title: "time"
    },
    {
      id: "num",
      title: "Total questions did"
    }
  ];
  const rows = [];
  const dataFromMicro = await csv({
    noheader: true,
    output: "csv"
  }).fromFile(
    "/Users/a1234/individual/abc/comment-survey2/be/CSVReport_8b367f03819a_B_Page#1_With_PageSize#5000.csv"
  );

  const answers = await Models.Answer.find();

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);

    const resultInMicro = dataFromMicro.find(item => item[2].trim() === user.email);

    rows.push({
      stt: i + 1,
      id: resultInMicro ? resultInMicro[0] : "",
      email: user.email,
      time: resultInMicro ? resultInMicro[1] : "",
      num: `${answer.questions.length.toString()}`
    });
  }

  const csvWriter = createCsvWriter({
    path: "./report-user(done-undone)(rais2).csv",
    header
  });
  await csvWriter.writeRecords(rows);
  console.log("DONE");
}
async function getUserEmail() {
  const users = await Models.User.find();
  const emails = _.map(users, "email").join("\n");

  fs.writeFileSync("./email(rais2).txt", emails, "utf-8");
}
async function explanationReport() {
  const header = [
    {
      id: "stt",
      title: "#"
    },
    {
      id: "email",
      title: "Email"
    },
    {
      id: "numberOfNumber",
      title: "Number of comment"
    },
    {
      id: "comment",
      title: "Comment"
    },
    {
      id: "agree",
      title: "Agree"
    },
    {
      id: "security",
      title: "Security"
    },
    {
      id: "privacy",
      title: "Privacy"
    },
    {
      id: "permission",
      title: "Permission"
    },
    {
      id: "collection",
      title: "Collection"
    },
    {
      id: "sharing",
      title: "Sharing"
    }
  ];
  const rows = [];
  let stt = 1;

  const [answers, comments] = await Promise.all([Models.Answer.find(), Models.Comment.find()]);

  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    const user = await Models.User.findById(answer.userId);

    for (let j = 0; j < answer.questions.length; j++) {
      const question = answer.questions[j];
      const comment = comments.find(comment => comment.commentId === question.commentId);
      const [firstRes, ...explainationRes] = question.responses;
      let row = {};

      row.agree = firstRes.value === "1" ? "Yes" : firstRes.value === "2" ? "Partially" : "No";
      if (firstRes.value === "0") {
        const security = explainationRes.find(item => item.name === "question11");
        if (security && security.value !== null) {
          row.security = security.value === "1" ? `Yes - ${security.reason}` : "No";
          console.log("security", security);
        }

        const privacy = explainationRes.find(item => item.name === "question12");
        if (privacy && privacy.value !== null) {
          console.log("privacy", privacy);
          row.privacy = privacy.value === "1" ? `Yes - ${privacy.reason}` : "No";
        }

        const permission = explainationRes.find(item => item.name === "question13");
        if (permission && permission.value !== null) {
          console.log("permission", permission);
          row.permission = permission.value === "1" ? `Yes - ${permission.reason}` : "No";
        }

        const collection = explainationRes.find(item => item.name === "question14");
        if (collection && collection.value !== null) {
          console.log("collection", collection);
          row.collection = collection.value === "1" ? `Yes - ${collection.reason}` : "No";
        }

        const sharing = explainationRes.find(item => item.name === "question15");
        if (sharing && sharing.value !== null) {
          console.log("sharing", sharing);
          row.sharing = sharing.value === "1" ? `Yes - ${sharing.reason}` : "No";
        }
      }

      rows.push({
        stt: stt++,
        email: user.email,
        numberOfNumber: j + 1,
        comment: comment.comment,
        ...row
      });
    }
  }

  const csvWriter = createCsvWriter({
    path: "./explaination(rais2).csv",
    header
  });
  await csvWriter.writeRecords(rows);

  console.log("DONE");
}
async function reportSurvey2() {
  const answers = await Models.Answer.find();

  const result = {
    0: 0,
    1: 0,
    2: 0
  };
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];

    for (let j = 0; j < answer.questions.length; j++) {
      const question = answer.questions[j];

      const firstRes = question.responses[0];

      result[firstRes.value]++;
    }
  }

  const total = _.sum(Object.values(result));
  const content = `
Yes: ${result[1]} (${((result[1] / total) * 100).toFixed(2)}%)
Partially: ${result[2]} (${((result[2] / total) * 100).toFixed(2)}%)
No: ${result[0]} (${((result[0] / total) * 100).toFixed(2)}%)
Total of comment: ${total}
		`;
  fs.writeFileSync("./report(rais2).txt", content, "utf-8");
}

// file2()
async function file2() {
  let result = {};
  const data = await csv({
    noheader: true,
    output: "csv"
  }).fromFile("/Users/a1234/Downloads/file2.csv");

  data.forEach(item => {
    if (!result[item[1]]) result[item[1]] = [];

    if (!result[item[1]].includes(item[7])) result[item[1]].push(item[7]);
  });

  console.log(result);
}

async function retry(promise, time) {
  let counter = 1;
  let status = false;
  let result;

  do {
    try {
      result = await promise;
      status = true;
    } catch (error) {
      result = error;
      counter++;

      await sleep(10 * 1000);
    }
  } while (!status && counter <= time);

  if (!status) throw result;

  return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
