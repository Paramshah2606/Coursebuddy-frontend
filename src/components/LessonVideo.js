'use client';

export default function LessonVideo({link}){
let splitLink=link.split("https://youtu.be/")[1];
let id=splitLink.split("?")[0];
var embedlink = "http://www.youtube.com/embed/" + id
    return (
        <div>
            <iframe width="560" height="315" src={embedlink} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
    )
}