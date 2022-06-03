const recognition = new webkitSpeechRecognition()
const synth = window.speechSynthesis;

localStorage["projsttts_banned"]||=""
let bannedWords=localStorage["projsttts_banned"].split(",")

localStorage["projsttts_num"]||="4"
let subtitleLineNum=parseInt(localStorage["projsttts_num"])
let lastSubtitles="".repeat(subtitleLineNum).split("")

const langs =
[['Afrikaans',       ['af-ZA']],
 ['አማርኛ',           ['am-ET']],
 ['Azərbaycanca',    ['az-AZ']],
 ['বাংলা',            ['bn-BD', 'বাংলাদেশ'],
                     ['bn-IN', 'ভারত']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-KE', 'Kenya'],
                     ['en-TZ', 'Tanzania'],
                     ['en-GH', 'Ghana'],
                     ['en-NZ', 'New Zealand'],
                     ['en-NG', 'Nigeria'],
                     ['en-ZA', 'South Africa'],
                     ['en-PH', 'Philippines'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Basa Jawa',       ['jv-ID']],
 ['Galego',          ['gl-ES']],
 ['ગુજરાતી',           ['gu-IN']],
 ['Hrvatski',        ['hr-HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['ಕನ್ನಡ',             ['kn-IN']],
 ['ភាសាខ្មែរ',          ['km-KH']],
 ['Latviešu',        ['lv-LV']],
 ['Lietuvių',        ['lt-LT']],
 ['മലയാളം',          ['ml-IN']],
 ['मराठी',             ['mr-IN']],
 ['Magyar',          ['hu-HU']],
 ['ລາວ',              ['lo-LA']],
 ['Nederlands',      ['nl-NL']],
 ['नेपाली भाषा',        ['ne-NP']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['සිංහල',          ['si-LK']],
 ['Slovenščina',     ['sl-SI']],
 ['Basa Sunda',      ['su-ID']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Kiswahili',       ['sw-TZ', 'Tanzania'],
                     ['sw-KE', 'Kenya']],
 ['ქართული',       ['ka-GE']],
 ['Հայերեն',          ['hy-AM']],
 ['தமிழ்',            ['ta-IN', 'இந்தியா'],
                     ['ta-SG', 'சிங்கப்பூர்'],
                     ['ta-LK', 'இலங்கை'],
                     ['ta-MY', 'மலேசியா']],
 ['తెలుగు',           ['te-IN']],
 ['Tiếng Việt',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['اُردُو',            ['ur-PK', 'پاکستان'],
                     ['ur-IN', 'بھارت']],
 ['Ελληνικά',         ['el-GR']],
 ['български',         ['bg-BG']],
 ['Pусский',          ['ru-RU']],
 ['Српски',           ['sr-RS']],
 ['Українська',        ['uk-UA']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['हिन्दी',             ['hi-IN']],
 ['ภาษาไทย',         ['th-TH']]];

let processing = false;

function startSTTTS() {
    processing = true
    recognition.stop();
    recognition.start();
    recognition.lang = localStorage["projsttts_lang"]||"cmn-Hans-CN"
    recognition.onresult = (e) => {
        let transcript=e.results[0][0].transcript;

        for(bannedword of bannedWords){
            if(transcript.includes(bannedword))transcript="**屏蔽的句子**"
        }

        lastSubtitles.push(transcript)
        if(lastSubtitles.length>subtitleLineNum)lastSubtitles.shift()
        $(".subtitle").text(lastSubtitles.join("\n"))

        

        const utterThis = new SpeechSynthesisUtterance(transcript);

        const voices = synth.getVoices();
        if (localStorage["projsttts_vocal"])
            for (let i = 0; i < voices.length; i++) {
                if (voices[i].name === localStorage["projsttts_vocal"]) {
                    utterThis.voice = voices[i];
                }
            }

        synth.speak(utterThis);
    }

    recognition.onend = (e) => {
        if (processing) recognition.start();
    }
}

$(".selectvocal.btn").click(async function () {
    let voices=synth.getVoices();
    const vocals = voices.reduce((pre, cur, ind) => {
        pre[ind] = cur.name;
        return pre;
    }, {})
    const { value: vocal } = await Swal.fire({
        title: '选择你的Vocal',
        input: 'select',
        inputOptions: vocals
    })
    localStorage["projsttts_vocal"] = voices[vocal].name
})

$(".selectlang.btn").click(async function () {
    const langs_processed=langs.reduce((p,c)=>{
        if(c.length==2)p[c[1][0]]=c[0];
        else{
            p[c[0]]=c.reduce((p,c,i)=>{
                if(i!=0)p[c[0]]=c[1]
                return p;
            },{})
        }
        return p;
    },{})
    const { value: lang } = await Swal.fire({
        title: '选择你的语言',
        input: 'select',
        inputOptions: langs_processed
    })
    localStorage["projsttts_lang"] = lang
})

$(".start.btn").click(function () {
    startSTTTS()
    $(".preparing").addClass("hidden")
    $(".processing").removeClass("hidden")
})

$(".pause.btn").click(function () {
    $(".preparing").removeClass("hidden")
    $(".processing").addClass("hidden")
    processing = false
    recognition.stop();
})

$(".stop.btn").click(function () {
    $(".preparing").removeClass("hidden")
    $(".processing").addClass("hidden")
    processing = false
    recognition.stop();
})

$(".subtitleLines.btn").click(async function(){
    const {value:lines}=await Swal.fire({
        input:"number",
        title:"请输入字幕行数"
    });
    if(lines){
        localStorage["projsttts_num"]=lines
        lastSubtitles=[]
        subtitleLineNum=parseInt(lines)
    }
})

$(".banwords.btn").click(async function(){
    localStorage["projsttts_banned"]||=""
    const {value:text}=await Swal.fire({
        input:"textarea",
        title:"请输入禁止词语",
        html:"用逗号分隔，如：<br><pre>词语一,字1</pre>",
        inputValue:localStorage["projsttts_banned"]
    });
    if(text){
        localStorage["projsttts_banned"]=text.replaceAll("，",",")
        bannedWords=localStorage["projsttts_banned"].split(",")
    }
})