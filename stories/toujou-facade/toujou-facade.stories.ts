import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-facade/src/index';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Facade',
  component: 'toujou-facade',
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
      <h3>Youtube iframe</h3>
      <toujou-facade class="facade" content-type="youtube">
        <figure slot="poster" class="facade__figure">
          <img src="https://picsum.photos/id/14/1200" alt="" loading="lazy" class="facade__poster-image">
        </figure>

        <button slot="trigger" class="facade__trigger">Show</button>
        <div slot="content" class="facade__content">
          <figure class="video">
            <iframe
              src="https://www.youtube-nocookie.com/embed/MRKy3kX8XUM?autohide=1&amp;controls=1&amp;loop=1&amp;playlist=MRKy3kX8XUM&amp;enablejsapi=1"
              class="video-embed-item"
              title="Bach - Violin Sonata no. 1 in G minor BWV 1001"
              allow="autoplay"
              ></iframe>
          </figure>
        </div>
      </toujou-facade>

      <h3>Vimeo iframe</h3>

      <toujou-facade class="facade" content-type="vimeo">
        <figure slot="poster" class="facade__figure">
          <img src="https://picsum.photos/id/14/1200" alt="" loading="lazy" class="facade__poster-image">
        </figure>

        <button slot="trigger" class="facade__trigger">Show</button>
        <div slot="content" class="facade__content">
          <figure class="video">
            <iframe
              src="https://player.vimeo.com/video/347119375?loop=1&amp;dnt=1&amp;title=0&amp;byline=0&amp;portrait=0"
              allowfullscreen=""
              playsinline=""
              poster=""
              video-extension="vimeo"
              data-is-autoplay="0"
              class="single-media__video video"
              title="Sample Video"
              allow="fullscreen"
              ></iframe>
          </figure>
        </div>
      </toujou-facade>
    `;

    return wrapper;
  },
};
