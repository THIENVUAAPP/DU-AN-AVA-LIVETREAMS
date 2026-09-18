import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Add getYoutubeId helper function inside MultistreamStudio component or outside
# Let's put it outside the component at the top
helper = """
const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};
"""

if "getYoutubeId" not in content:
    content = content.replace("export default function MultistreamStudio", helper + "\nexport default function MultistreamStudio")

# Fix Single Monitor
old_single = """<ReactPlayer 
                        key={activeVideoUrl} 
                        url={activeVideoUrl} 
                        playing={true} 
                        loop={true} 
                        muted={false} 
                        controls={true} 
                        width="100%" 
                        height="100%" 
                     />"""

new_single = """{getYoutubeId(activeVideoUrl) ? (
                        <iframe 
                           key={activeVideoUrl}
                           src={`https://www.youtube.com/embed/${getYoutubeId(activeVideoUrl)}?autoplay=1&mute=0&controls=1&loop=1&playlist=${getYoutubeId(activeVideoUrl)}`} 
                           width="100%" 
                           height="100%" 
                           frameBorder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                           className="w-full h-full"
                        ></iframe>
                     ) : (
                        <ReactPlayer 
                           key={activeVideoUrl} 
                           url={activeVideoUrl} 
                           playing={true} 
                           loop={true} 
                           muted={false} 
                           controls={true} 
                           width="100%" 
                           height="100%" 
                        />
                     )}"""

content = content.replace(old_single, new_single)

# Fix Matrix Monitor
old_matrix = """<ReactPlayer 
                            url={activeVideoUrl} 
                            playing={true} 
                            loop={true} 
                            muted={true} 
                            controls={false} 
                            width="100%" 
                            height="100%" 
                         />"""

new_matrix = """{getYoutubeId(activeVideoUrl) ? (
                            <iframe 
                               src={`https://www.youtube.com/embed/${getYoutubeId(activeVideoUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYoutubeId(activeVideoUrl)}`} 
                               width="100%" 
                               height="100%" 
                               frameBorder="0" 
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                               allowFullScreen
                               className="w-full h-full pointer-events-none"
                            ></iframe>
                         ) : (
                            <ReactPlayer 
                               url={activeVideoUrl} 
                               playing={true} 
                               loop={true} 
                               muted={true} 
                               controls={false} 
                               width="100%" 
                               height="100%" 
                            />
                         )}"""

content = content.replace(old_matrix, new_matrix)


with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

