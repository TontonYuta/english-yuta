/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LessonList from './pages/LessonList';
import LessonDetail from './pages/LessonDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-[100dvh] bg-notebook font-sans text-ink selection:bg-highlighter/50 flex justify-center">
        <main className="w-full flex">
          <Routes>
            <Route path="/" element={<LessonList />} />
            <Route path="/lesson/:id" element={<LessonDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
