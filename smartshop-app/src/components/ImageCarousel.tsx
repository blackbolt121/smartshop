import React from "react";
import austromex from "../assets/austromex.png";
import ax from "../assets/ax.png";
import camca from "../assets/camca.png";
import craftop from "../assets/craftop.jpg";
import fischer from "../assets/fischer.png";
import high_power from "../assets/high_power.png";
import ingusa from "../assets/ingusa.png";
import ipesa from "../assets/ipesa.jpg";
import itc from "../assets/itc.png";
import licon from "../assets/licon.png";
import montana from "../assets/montana.jpg";
import munich from "../assets/munich.png";
import oakland_tools from "../assets/oakland_tools.png";
import santul from "../assets/santul.png";
import urrea from "../assets/urrea.jpg";
import urrea2 from "../assets/urrea2.png";
import arj from "../assets/arj.jpg";
import azteca from "../assets/azteca.png";
import b2m from "../assets/b&m.png";
import brotimex from "../assets/brotimex.jpg";
import foy from "../assets/foy.png"
import group_cn from "../assets/grup_cn.png";
import kola_loca from "../assets/kola_loca.png"
import litelux from "../assets/litelux.png"
import palcove from "../assets/placove.png"
import surtex from "../assets/surtex.jpg"
import acuario from "../assets/acuario.png"
import amiber from "../assets/amiber.png"
import metalfu from "../assets/metalfu.png"


const images = [
    austromex,
    ax,
    camca,
    craftop,
    fischer,
    high_power,
    ingusa,
    ipesa,
    itc,
    licon,
    montana,
    munich,
    oakland_tools,
    santul,
    urrea,
    urrea2,
    arj,
    azteca,
    b2m,
    brotimex,
    foy,
    group_cn,
    kola_loca,
    litelux,
    palcove,
    surtex,
    acuario,
    amiber,
    metalfu

];

const ImageCarousel = () => {
    return (
        <div className="overflow-hidden">
            <div className="flex w-max animate-scroll gap-2 h-20">
                {images.map((img, index) => (
                    <img key={index} src={img} alt={`img-${index}`} className="w-40 h-auto rounded-md" />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
