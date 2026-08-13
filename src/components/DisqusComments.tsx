import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

export const DisqusComments: React.FC = () => {
  useEffect(() => {
    // Inject count.js script
    const countScriptId = 'dsq-count-scr';
    if (!document.getElementById(countScriptId)) {
      const script = document.createElement('script');
      script.id = countScriptId;
      script.src = '//agentic-ai-demo-rk.disqus.com/count.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Inject embed.js script or reset DISQUS if already loaded
    if ((window as any).DISQUS) {
      (window as any).DISQUS.reset({
        reload: true,
      });
    } else {
      const embedScriptId = 'disqus-embed-scr';
      if (!document.getElementById(embedScriptId)) {
        const d = document;
        const s = d.createElement('script');
        s.id = embedScriptId;
        s.src = 'https://agentic-ai-demo-rk.disqus.com/embed.js';
        s.setAttribute('data-timestamp', (+new Date()).toString());
        (d.head || d.body).appendChild(s);
      }
    }
  }, []);

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 mb-16">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#1A1A1A]/12 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#1A1A1A]/10">
          <MessageSquare className="w-5 h-5 text-[#1A1A1A]" />
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#1A1A1A]/50 block">
              03 / Community Exchange
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
              Market Discussion & Community Forum
            </h3>
          </div>
        </div>

        {/* Disqus Thread Container */}
        <div id="disqus_thread" className="min-h-[220px]"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="underline text-[#1A1A1A]">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </section>
  );
};
