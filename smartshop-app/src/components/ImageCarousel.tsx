import urrea from "../assets/urrea.jpg";
// import foy from "../assets/foy.png"
import surtex from "../assets/surtex.jpg"
// import prolock from "../assets/prolock.jpg"
import lock from "../assets/lock.jpg"
// import proforza from "../assets/proforza.jpg"
// import balta from "../assets/balta.jpg"



const images = [
    //austromex,
    // ax,
    // camca,
    // craftop,
    // fischer,
    // high_power,
    // ingusa,
    // ipesa,
    // itc,
    // licon,
    // montana,
    // munich,
    // oakland_tools,
    // santul,
    urrea,
    //urrea2,
    // arj,
    // azteca,
    // b2m,
    // brotimex,
    // foy,
    // group_cn,
    // kola_loca,
    // litelux,
    // palcove,
    surtex,
    //prolock,
    lock,
    // proforza,
    // balta
    // acuario,
    // amiber,
    // metalfu

];

const ImageCarousel = () => {
    return (
        <div className="overflow-hidden">
            <div className="flex items-center justify-center gap-[10%]">
                {images.map((img, index) => (
                    <img key={index} src={img} alt={`img-${index}`} className="w-40 h-auto rounded-md" />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
