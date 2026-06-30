import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-poster-reveal/src/index';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Poster Reveal',
  component: 'toujou-poster-reveal',
  parameters: {
    toujouThemes: [
      THEME_NAMES.TOUJOU_V1,
      THEME_NAMES.TOUJOU_V1_5,
      THEME_NAMES.HISSU_V1,
      THEME_NAMES.HISSU_V1_5,
      THEME_NAMES.TABI_V1,
      THEME_NAMES.TABI_V1_5,
      THEME_NAMES.MEDATSU_V1,
      THEME_NAMES.MEDATSU_V1_5,
      THEME_NAMES.KOJO,
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ],
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo', 'other', 'customizations'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.containerType = 'inline-size';
    wrapper.style.containerName = 'containerWrapper';

    wrapper.innerHTML = `
      <toujou-poster-reveal class="poster-reveal">
        <figure slot="poster" class="poster-reveal__figure">
          <img src="https://picsum.photos/id/14/1200" alt="" loading="lazy" class="poster-reveal__poster-image">
        </figure>

        <button slot="trigger" class="poster-reveal__trigger">Show Content</button>

        <div slot="content" class="poster-reveal__content">
          <figure class="video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/MRKy3kX8XUM?autohide=1&amp;controls=1&amp;loop=1&amp;playlist=MRKy3kX8XUM&amp;enablejsapi=1"
              class="video-embed-item"
              title="Bach - Violin Sonata no. 1 in G minor BWV 1001"
              allow="autoplay"
              ></iframe>
          </figure>
        </div>
      </toujou-poster-reveal>
    `;

    return wrapper;
  },
};
