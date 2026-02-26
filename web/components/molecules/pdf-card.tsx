import { FaFilePdf } from 'react-icons/fa';

interface PdfCardProps {
  name?: string;
  size?: number;

  url?: string;
}

export const PdfCard: React.FC<PdfCardProps> = ({ name, size, url }) => (
  <a
    href={url}
    target="_blank"
    id="pdf-download"
    className="overflow-hidden rounded-lg border border-gray-200 px-2 py-4 flex flex-row hover:shadow-normal cursor-pointer" rel="noreferrer"
  >
    <FaFilePdf className="text-red-600" size="48px" />
    <div className="px-2 flex flex-col space-y-1">
      <div className="text-slate-600 line-clamp-2 text-sm">{name}</div>
      <div className="text-gray-secondary line-clamp-2 text-sm opacity-80">
        {size}k
      </div>
    </div>
  </a>
);
