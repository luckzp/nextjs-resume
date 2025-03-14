import MarkdownIt from 'markdown-it';

declare module 'markdown-it-ins' {
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
}

declare module 'markdown-it-mark' {
  const plugin: MarkdownIt.PluginSimple;
  export default plugin;
} 